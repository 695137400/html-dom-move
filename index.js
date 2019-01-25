function domMove(id) {
            var _this = document.getElementById(id);

            _this.bind = function ($el, eventType, fn, useCapture) {
                if (!$el) {
                    return;
                }
                if (useCapture === undefined) {
                    useCapture = false;
                }
                $el.addEventListener(eventType, fn, useCapture);
            };
            _this.switchPos = {
                x: 10, // right
                y: 10, // bottom
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0
            };
            var dpr = window.devicePixelRatio || 1;
            var tapTime = 700, // maximun tap interval
                tapBoundary = 10; // max tap move distance

            var lastTouchStartTime,
                touchstartX,
                touchstartY,
                touchHasMoved = false,
                targetElem = null;

            _this.addEventListener('touchstart', function (e) { // todo: if double click
                console.log('touchstart');
                if (lastTouchStartTime === undefined) {
                    var touch = e.targetTouches[0];
                    touchstartX = touch.pageX;
                    touchstartY = touch.pageY;
                    lastTouchStartTime = e.timeStamp;
                    targetElem = (e.target.nodeType === Node.TEXT_NODE ? e.target.parentNode : e.target);
                }
            }, false);

            _this.addEventListener('touchmove', function (e) {
                console.log('touchmove');
                var touch = e.changedTouches[0];
                if (Math.abs(touch.pageX - touchstartX) > tapBoundary || Math.abs(touch.pageY - touchstartY) > tapBoundary) {
                    touchHasMoved = true;
                }
            });

            _this.addEventListener('touchend', function (e) {
                console.log('touchend');
                // move and time within limits, manually trigger `click` event
                if (touchHasMoved === false && e.timeStamp - lastTouchStartTime < tapTime && targetElem != null) {
                    var touch = e.changedTouches[0];
                    var event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
                    event.forwardedTouchEvent = true;
                    event.initEvent('click', true, true);
                    targetElem.dispatchEvent(event);
                }

                // reset values
                lastTouchStartTime = undefined;
                touchHasMoved = false;
                targetElem = null;
            }, false);

            _this.bind(_this, 'touchstart', function (e) {
                _this.switchPos.startX = e.touches[0].pageX;
                _this.switchPos.startY = e.touches[0].pageY;
            });
            _this.bind(_this, 'touchend', function (e) {
                _this.switchPos.x = _this.switchPos.endX;
                _this.switchPos.y = _this.switchPos.endY;
                _this.switchPos.startX = 0;
                _this.switchPos.startY = 0;
                _this.switchPos.endX = 0;
                _this.switchPos.endY = 0;
            });
            _this.bind(_this, 'touchmove', function (e) {
                if (e.touches.length > 0) {
                    var offsetX = e.touches[0].pageX - _this.switchPos.startX,
                        offsetY = e.touches[0].pageY - _this.switchPos.startY;
                    var x = _this.switchPos.x - offsetX,
                        y = _this.switchPos.y - offsetY;
                    // check edge
                    if (x + _this.offsetWidth > document.documentElement.offsetWidth) {
                        x = document.documentElement.offsetWidth - _this.offsetWidth;
                    }
                    if (y + _this.offsetHeight > document.documentElement.offsetHeight) {
                        y = document.documentElement.offsetHeight - _this.offsetHeight;
                    }
                    if (x < 0) {
                        x = 0;
                    }
                    if (y < 0) {
                        y = 0;
                    }
                    _this.style.right = x + 'px';
                    _this.style.bottom = y + 'px';
                    _this.switchPos.endX = x;
                    _this.switchPos.endY = y;
                    e.preventDefault();
                }
            });
        }
