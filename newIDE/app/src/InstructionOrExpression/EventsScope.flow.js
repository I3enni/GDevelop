// @flow
const gd: libGDevelop = global.gd;

// Instruction or expression can be private (see IsPrivate, SetPrivate).
// Their visibility will change according to the scope (i.e: if we're
// editing events in a behavior, private instructions of the behavior
// will be visible).
export type EventsScope = {|
  project: gdProject,
  layout?: ?gdLayout,
  externalEvents?: ?gdExternalEvents,
  eventsFunctionsExtension?: gdEventsFunctionsExtension,
  eventsBasedBehavior?: ?gdEventsBasedBehavior,
  eventsBasedObject?: ?gdEventsBasedObject,
  eventsFunction?: ?gdEventsFunction,
|};

export class ProjectScopedContainersAccessor {
  _scope: EventsScope;
  _globalObjectsContainer: gdObjectsContainer;
  _objectsContainer: gdObjectsContainer;
  _eventPath: Array<gdBaseEvent>;

  constructor(
    scope: EventsScope,
    globalObjectsContainer: gdObjectsContainer,
    objectsContainer: gdObjectsContainer,
    eventPath: Array<gdBaseEvent> = []
  ) {
    this._scope = scope;
    this._globalObjectsContainer = globalObjectsContainer;
    this._objectsContainer = objectsContainer;
    this._eventPath = eventPath;
  }

  get(): gdProjectScopedContainers {
    let projectScopedContainers;
    const {
      project,
      layout,
      eventsFunctionsExtension,
      eventsBasedBehavior,
      eventsBasedObject,
      eventsFunction,
    } = this._scope;
    if (layout) {
      projectScopedContainers = gd.ProjectScopedContainers.makeNewProjectScopedContainersForProjectAndLayout(
        project,
        layout
      );
    } else if (eventsFunction) {
      if (eventsBasedBehavior) {
        projectScopedContainers = gd.ProjectScopedContainers.makeNewProjectScopedContainersForBehaviorEventsFunction(
          project,
          eventsBasedBehavior,
          eventsFunction,
          this._globalObjectsContainer,
          this._objectsContainer
        );
      } else if (eventsBasedObject) {
        projectScopedContainers = gd.ProjectScopedContainers.makeNewProjectScopedContainersForObjectEventsFunction(
          project,
          eventsBasedObject,
          eventsFunction,
          this._globalObjectsContainer,
          this._objectsContainer
        );
      } else if (eventsFunctionsExtension) {
        projectScopedContainers = gd.ProjectScopedContainers.makeNewProjectScopedContainersForFreeEventsFunction(
          project,
          eventsFunctionsExtension,
          eventsFunction,
          this._globalObjectsContainer,
          this._objectsContainer
        );
      } else {
        throw new Error(
          'Called `ProjectScopedContainers.get` with an eventsFunction but without eventsBasedBehavior, eventsBasedObject or eventsFunctionsExtension'
        );
      }
    } else {
      throw new Error(
        'Called `ProjectScopedContainers.get` without a layout or an eventsFunction'
      );
    }
    for (const event of this._eventPath) {
      projectScopedContainers = gd.ProjectScopedContainers.makeNewProjectScopedContainersWithLocalVariables(
        projectScopedContainers,
        event
      );
    }

    return projectScopedContainers;
  }

  makeNewProjectScopedContainersWithLocalVariables(event: gdBaseEvent) {
    return new ProjectScopedContainersAccessor(
      this._scope,
      this._globalObjectsContainer,
      this._objectsContainer,
      [...this._eventPath, event]
    );
  }
}
