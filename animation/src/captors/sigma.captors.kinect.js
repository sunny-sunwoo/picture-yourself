;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.captors');

  /**
   * The user inputs default captor. It deals with mouse events, keyboards
   * events and touch events.
   *
   * @param  {DOMElement}   target   The DOM element where the listeners will be
   *                                 bound.
   * @param  {camera}       camera   The camera related to the target.
   * @param  {configurable} settings The settings function.
   * @return {sigma.captor}          The fresh new captor instance.
   */
  sigma.captors.kinect = function(target, camera, settings) {
    var _self = this,
        _target = target,
        _camera = camera,
        _settings = settings,

        // CAMERA MANAGEMENT:
        // ******************
        // The camera position when the user starts dragging:
        _startCameraX,
        _startCameraY,
        _startCameraAngle,
        _startCameraRatio,

        // The latest stage position:
        _lastCameraX,
        _lastCameraY,
        _lastKinectZ,
        _lastCameraAngle,
        _lastCameraRatio,

        // MOUSE MANAGEMENT:
        // *****************
        // The mouse position when the user starts dragging:
        _startMouseX,
        _startMouseY,
        _startKinectZ,

        _isMouseDown,
        _isMoving,
        _hasDragged,
        _downStartTime,
        _movingTimeoutId,
        
        _bodyFrame;

    sigma.classes.dispatcher.extend(this);

    var socket = io("http://localhost:3000");
    //var socket = io("http://128.2.236.245:3000");

    socket.on("disconnect", function() {
      console.log("Disconnected");
    })

    socket.on("connect", function() {
      console.log("Connected to Kinect Server");
    })

    socket.on("bodyFrame", function(bodyFrame) {
      //console.log(bodyFrame);
      var realBody = null,
          head;

      for (var i = 0; i < bodyFrame.bodies.length; i++) {
        var body = bodyFrame.bodies[i];
        if (body.tracked) {
          if (realBody == null || body.joints[3].cameraZ < realBody.joints[3].cameraZ) {
            realBody = body;
          }
          //break;
        }
      }

      if (realBody == null) return;
      head = realBody.joints[3];
      //console.log(head);

      if (_bodyFrame == null) {
        _kinectDownHandler(head);
      }
      _bodyFrame = bodyFrame;

      _kinectMoveHandler(head);
      //_kinectWheelHandler(head);
    })

    window.addEventListener('show_picture', function() {
      console.log("show_picture");
      _bodyFrame = null;
    });

    function _kinectWheelHandler(head) {
      var pos,
          ratio,
          coordinates,
          newRatio;

      newRatio = Math.max(
        0.01,
        1 - 0.5 * (_startKinectZ - head.cameraZ)
      );
      //console.log(head.cameraZ, _startKinectZ, newRatio);

      if (newRatio != _camera.ratio) {
        ratio = newRatio / camera.ratio;
        pos = _camera.cameraPosition(
          (head.depthX - 0.5) * 1000,
          (head.depthY - 0.5) * 1000,
          true
        );
        pos.x = 0;
        pos.y = 0;
        coordinates = {
          x: pos.x * (1 - ratio) + _camera.x,
          y: pos.y * (1 - ratio) + _camera.y,
          ratio: newRatio
        };
        _camera.goTo(coordinates);
      }
    }

    function _kinectMoveHandler(head) {
      var x,
          y,
          newRatio,
          pos;

      if (_isMouseDown) {
        _isMoving = true;

        sigma.misc.animation.killAll(_camera);

        _camera.isMoving = true;

        var scale = 1000 + 8000 * (_startKinectZ - head.cameraZ);

        let depthY = head.depthY;
        depthY -= (_startKinectZ - head.cameraZ) / 20;

        pos = _camera.cameraPosition(
          (_startMouseX - head.depthX) * scale,
          (_startMouseY - depthY) * scale,
          true
        );

        x = _startCameraX - pos.x;
        y = _startCameraY - pos.y;

        newRatio = Math.max(
          0.05,
          1 - 0.65 * (_startKinectZ - head.cameraZ)
        );
        //console.log(head.depthY, depthY, newRatio)

        if (x !== _camera.x || y !== _camera.y || newRatio != _camera.ratio) {
          _lastCameraX = _camera.x;
          _lastCameraY = _camera.y;

          _camera.goTo({
            x: x,
            y: y,
            ratio: newRatio
          });
        }
      }
    }

    function _kinectDownHandler(head) {
      console.log("_kinectDownHandler")
      _camera.goTo({
        x:0,
        y:0
      });
      _startCameraX = _camera.x;
      _startCameraY = _camera.y;
      _startCameraRatio = _camera.ratio;

      _lastCameraX = _camera.x;
      _lastCameraY = _camera.y;
      _lastKinectZ = head.cameraZ;
      _lastCameraRatio = 1;

      _startMouseX = head.depthX;
      _startMouseY = head.depthY;
      _startKinectZ = head.cameraZ;

      _isMouseDown = true;
    }

    //sigma.utils.doubleClick(_target, 'click', _doubleClickHandler);
    //_target.addEventListener('DOMMouseScroll', _wheelHandler, false);
    //_target.addEventListener('mousewheel', _wheelHandler, false);
    //_target.addEventListener('mousemove', _moveHandler, false);
    //_target.addEventListener('mousedown', _downHandler, false);
    //_target.addEventListener('click', _clickHandler, false);
    //_target.addEventListener('mouseout', _outHandler, false);
    //document.addEventListener('mouseup', _upHandler, false);




    /**
     * This method unbinds every handlers that makes the captor work.
     */
    this.kill = function() {
      sigma.utils.unbindDoubleClick(_target, 'click');
      _target.removeEventListener('DOMMouseScroll', _wheelHandler);
      _target.removeEventListener('mousewheel', _wheelHandler);
      _target.removeEventListener('mousemove', _moveHandler);
      _target.removeEventListener('mousedown', _downHandler);
      _target.removeEventListener('click', _clickHandler);
      _target.removeEventListener('mouseout', _outHandler);
      document.removeEventListener('mouseup', _upHandler);
    };




    // MOUSE EVENTS:
    // *************

    /**
     * The handler listening to the 'move' mouse event. It will effectively
     * drag the graph.
     *
     * @param {event} e A mouse event.
     */
    function _moveHandler(e) {
      var x,
          y,
          pos;

      // Dispatch event:
      if (_settings('mouseEnabled')) {
        _self.dispatchEvent('mousemove',
          sigma.utils.mouseCoords(e));

        if (_isMouseDown) {
          _isMoving = true;
          _hasDragged = true;

          if (_movingTimeoutId)
            clearTimeout(_movingTimeoutId);

          _movingTimeoutId = setTimeout(function() {
            _isMoving = false;
          }, _settings('dragTimeout'));

          sigma.misc.animation.killAll(_camera);

          _camera.isMoving = true;
          pos = _camera.cameraPosition(
            sigma.utils.getX(e) - _startMouseX,
            sigma.utils.getY(e) - _startMouseY,
            true
          );

          x = _startCameraX - pos.x;
          y = _startCameraY - pos.y;

          if (x !== _camera.x || y !== _camera.y) {
            _lastCameraX = _camera.x;
            _lastCameraY = _camera.y;

            _camera.goTo({
              x: x,
              y: y
            });
          }

          if (e.preventDefault)
            e.preventDefault();
          else
            e.returnValue = false;

          e.stopPropagation();
          return false;
        }
      }
    }

    /**
     * The handler listening to the 'up' mouse event. It will stop dragging the
     * graph.
     *
     * @param {event} e A mouse event.
     */
    function _upHandler(e) {
      if (_settings('mouseEnabled') && _isMouseDown) {
        _isMouseDown = false;
        if (_movingTimeoutId)
          clearTimeout(_movingTimeoutId);

        _camera.isMoving = false;

        var x = sigma.utils.getX(e),
            y = sigma.utils.getY(e);

        if (_isMoving) {
          sigma.misc.animation.killAll(_camera);
          sigma.misc.animation.camera(
            _camera,
            {
              x: _camera.x +
                _settings('mouseInertiaRatio') * (_camera.x - _lastCameraX),
              y: _camera.y +
                _settings('mouseInertiaRatio') * (_camera.y - _lastCameraY)
            },
            {
              easing: 'quadraticOut',
              duration: _settings('mouseInertiaDuration')
            }
          );
        } else if (
          _startMouseX !== x ||
          _startMouseY !== y
        )
          _camera.goTo({
            x: _camera.x,
            y: _camera.y
          });

        _self.dispatchEvent('mouseup',
          sigma.utils.mouseCoords(e));

        // Update _isMoving flag:
        _isMoving = false;
      }
    }

    /**
     * The handler listening to the 'down' mouse event. It will start observing
     * the mouse position for dragging the graph.
     *
     * @param {event} e A mouse event.
     */
    function _downHandler(e) {
      if (_settings('mouseEnabled')) {
        _startCameraX = _camera.x;
        _startCameraY = _camera.y;

        _lastCameraX = _camera.x;
        _lastCameraY = _camera.y;

        _startMouseX = sigma.utils.getX(e);
        _startMouseY = sigma.utils.getY(e);

        _hasDragged = false;
        _downStartTime = (new Date()).getTime();

        switch (e.which) {
          case 2:
            // Middle mouse button pressed
            // Do nothing.
            break;
          case 3:
            // Right mouse button pressed
            _self.dispatchEvent('rightclick',
              sigma.utils.mouseCoords(e, _startMouseX, _startMouseY));
            break;
          // case 1:
          default:
            // Left mouse button pressed
            _isMouseDown = true;

            _self.dispatchEvent('mousedown',
              sigma.utils.mouseCoords(e, _startMouseX, _startMouseY));
        }
      }
    }

    /**
     * The handler listening to the 'out' mouse event. It will just redispatch
     * the event.
     *
     * @param {event} e A mouse event.
     */
    function _outHandler(e) {
      if (_settings('mouseEnabled'))
        _self.dispatchEvent('mouseout');
    }

    /**
     * The handler listening to the 'click' mouse event. It will redispatch the
     * click event, but with normalized X and Y coordinates.
     *
     * @param {event} e A mouse event.
     */
    function _clickHandler(e) {
      if (_settings('mouseEnabled')) {
        var event = sigma.utils.mouseCoords(e);
        event.isDragging =
          (((new Date()).getTime() - _downStartTime) > 100) && _hasDragged;
        _self.dispatchEvent('click', event);
      }

      if (e.preventDefault)
        e.preventDefault();
      else
        e.returnValue = false;

      e.stopPropagation();
      return false;
    }

    /**
     * The handler listening to the double click custom event. It will
     * basically zoom into the graph.
     *
     * @param {event} e A mouse event.
     */
    function _doubleClickHandler(e) {
      var pos,
          ratio,
          animation;

      if (_settings('mouseEnabled')) {
        ratio = 1 / _settings('doubleClickZoomingRatio');

        _self.dispatchEvent('doubleclick',
            sigma.utils.mouseCoords(e, _startMouseX, _startMouseY));

        if (_settings('doubleClickEnabled')) {
          pos = _camera.cameraPosition(
            sigma.utils.getX(e) - sigma.utils.getCenter(e).x,
            sigma.utils.getY(e) - sigma.utils.getCenter(e).y,
            true
          );

          animation = {
            duration: _settings('doubleClickZoomDuration')
          };

          sigma.utils.zoomTo(_camera, pos.x, pos.y, ratio, animation);
        }

        if (e.preventDefault)
          e.preventDefault();
        else
          e.returnValue = false;

        e.stopPropagation();
        return false;
      }
    }

    /**
     * The handler listening to the 'wheel' mouse event. It will basically zoom
     * in or not into the graph.
     *
     * @param {event} e A mouse event.
     */
    function _wheelHandler(e) {
      var pos,
          ratio,
          animation,
          wheelDelta = sigma.utils.getDelta(e);

      if (_settings('mouseEnabled') && _settings('mouseWheelEnabled') && wheelDelta !== 0) {
        ratio = wheelDelta > 0 ?
          1 / _settings('zoomingRatio') :
          _settings('zoomingRatio');

        pos = _camera.cameraPosition(
          sigma.utils.getX(e) - sigma.utils.getCenter(e).x,
          sigma.utils.getY(e) - sigma.utils.getCenter(e).y,
          true
        );

        animation = {
          duration: _settings('mouseZoomDuration')
        };

        sigma.utils.zoomTo(_camera, pos.x, pos.y, ratio, animation);

        if (e.preventDefault)
          e.preventDefault();
        else
          e.returnValue = false;

        e.stopPropagation();
        return false;
      }
    }
  };
}).call(this);
