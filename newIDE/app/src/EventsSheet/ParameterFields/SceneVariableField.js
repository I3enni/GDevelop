// @flow
import * as React from 'react';
import { type ParameterInlineRendererProps } from './ParameterInlineRenderer.flow';
import VariableField, {
  renderVariableWithIcon,
  type VariableFieldInterface,
} from './VariableField';
import SceneVariablesDialog from '../../SceneEditor/SceneVariablesDialog';
import {
  type ParameterFieldProps,
  type ParameterFieldInterface,
  type FieldFocusFunction,
} from './ParameterFieldCommons';
import { enumerateVariables } from './EnumerateVariables';
import SceneIcon from '../../UI/CustomSvgIcons/Scene';

export default React.forwardRef<ParameterFieldProps, ParameterFieldInterface>(
  function SceneVariableField(props: ParameterFieldProps, ref) {
    const field = React.useRef<?VariableFieldInterface>(null);
    const [editorOpen, setEditorOpen] = React.useState(false);
    const focus: FieldFocusFunction = options => {
      if (field.current) field.current.focus(options);
    };
    React.useImperativeHandle(ref, () => ({
      focus,
    }));

    const { project, scope } = props;
    const { layout } = scope;

    const variablesContainers = React.useMemo(
      () => {
        return layout ? [layout.getVariables()] : [];
      },
      [layout]
    );

    const enumerateSceneVariables = React.useCallback(
      () => {
        return layout
          ? enumerateVariables(layout.getVariables()).map(variable => ({
              ...variable,
              renderIcon: () => <SceneIcon />,
            }))
          : [];
      },
      [layout]
    );

    return (
      <React.Fragment>
        <VariableField
          variablesContainers={variablesContainers}
          enumerateVariables={enumerateSceneVariables}
          parameterMetadata={props.parameterMetadata}
          value={props.value}
          onChange={props.onChange}
          isInline={props.isInline}
          onRequestClose={props.onRequestClose}
          onApply={props.onApply}
          ref={field}
          onOpenDialog={() => setEditorOpen(true)}
          globalObjectsContainer={props.globalObjectsContainer}
          objectsContainer={props.objectsContainer}
          scope={scope}
          id={
            props.parameterIndex !== undefined
              ? `parameter-${props.parameterIndex}-scene-variable-field`
              : undefined
          }
        />
        {editorOpen && layout && project && (
          <SceneVariablesDialog
            project={project}
            layout={layout}
            open
            onCancel={() => setEditorOpen(false)}
            onApply={(selectedVariableName: string | null) => {
              if (
                selectedVariableName &&
                selectedVariableName.startsWith(props.value)
              ) {
                props.onChange(selectedVariableName);
              }
              setEditorOpen(false);
              if (field.current) field.current.updateAutocompletions();
            }}
            preventRefactoringToDeleteInstructions
          />
        )}
      </React.Fragment>
    );
  }
);

export const renderInlineSceneVariable = (
  props: ParameterInlineRendererProps
) => renderVariableWithIcon(props, SceneIcon, 'scene variable');
