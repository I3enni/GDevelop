/**

GDevelop - Draggable Automatism Extension
Copyright (c) 2014-2015 Florian Rival (Florian.Rival@gmail.com)
This project is released under the MIT License.
*/

#include <memory>
#include <iostream>
#include <SFML/Graphics.hpp>
#include "DraggableAutomatism.h"
#include "GDCpp/Scene.h"
#include "GDCpp/RuntimeLayer.h"
#include "GDCpp/Serialization/SerializerElement.h"
#include "GDCpp/RuntimeScene.h"
#include "GDCpp/RuntimeObject.h"
#include "GDCpp/CommonTools.h"

bool DraggableAutomatism::somethingDragged = false;
bool DraggableAutomatism::leftPressedLastFrame = false;

DraggableAutomatism::DraggableAutomatism() :
    dragged(false)
{
}

void DraggableAutomatism::DoStepPreEvents(RuntimeScene & scene)
{
    //Begin drag ?
    if ( !dragged && scene.GetInputManager().IsMouseButtonPressed("Left") &&
        !leftPressedLastFrame && !somethingDragged )
    {
        RuntimeLayer & theLayer = scene.GetRuntimeLayer(object->GetLayer());
        for (std::size_t cameraIndex = 0;cameraIndex < theLayer.GetCameraCount();++cameraIndex)
        {
            sf::Vector2f mousePos = scene.renderWindow->mapPixelToCoords(
                scene.GetInputManager().GetMousePosition(), theLayer.GetCamera(cameraIndex).GetSFMLView());

            if ( object->GetDrawableX() <= mousePos.x
                && object->GetDrawableX() + object->GetWidth() >= mousePos.x
                && object->GetDrawableY() <= mousePos.y
                && object->GetDrawableY() + object->GetHeight() >= mousePos.y )
            {
                dragged = true;
                somethingDragged = true;
                xOffset = mousePos.x - object->GetX();
                yOffset = mousePos.y - object->GetY();
                dragCameraIndex = cameraIndex;
                break;
            }
        }
    }
    //End dragging ?
    else if ( !scene.GetInputManager().IsMouseButtonPressed("Left") ) {
        dragged = false;
        somethingDragged = false;
    }

    //Being dragging ?
    if ( dragged ) {
        RuntimeLayer & theLayer = scene.GetRuntimeLayer(object->GetLayer());
        sf::Vector2f mousePos = scene.renderWindow->mapPixelToCoords(
            scene.GetInputManager().GetMousePosition(), theLayer.GetCamera(dragCameraIndex).GetSFMLView());

        object->SetX(mousePos.x-xOffset);
        object->SetY(mousePos.y-yOffset);
    }

}

void DraggableAutomatism::DoStepPostEvents(RuntimeScene & scene)
{
    leftPressedLastFrame = scene.GetInputManager().IsMouseButtonPressed("Left");
}

void DraggableAutomatism::OnDeActivate()
{
    if (dragged) somethingDragged = false;
    dragged = false;
}
