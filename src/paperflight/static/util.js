/**
 * General purpose functions
 */
function isPointInRamp(x, y, ramp) {
    var yDelta = (x - ramp.x) * ramp.slope
    return ramp.x < x && x < ramp.x + ramp.width && ramp.y < y + yDelta && y + yDelta < ramp.y + ramp.height
}
function isPointInBox(x, y, box) {
    return box.x <= x && x <= box.x + box.width && box.y <= y && y <= box.y + box.height
}
function isPlaneInBox(box) {
    return isPointInBox(plane.x, plane.y, box)
        || isPointInBox(plane.x + plane.width, plane.y, box)
        || isPointInBox(plane.x + plane.width, plane.y + plane.height, box)
        || isPointInBox(plane.x, plane.y + plane.height, box)
}
function isPointInCircle(x, y, circle) {
    return Math.sqrt(Math.pow(x - circle.x, 2) + Math.pow(y - circle.y, 2)) < circle.radius
}
function isPlaneInCircle(circle) {
    return isPointInCircle(plane.x, plane.y, circle)
        || isPointInCircle(plane.x + plane.width, plane.y, circle)
        || isPointInCircle(plane.x + plane.width, plane.y + plane.height, circle)
        || isPointInCircle(plane.x, plane.y + plane.height, circle)
}