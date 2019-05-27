var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Vector = /** @class */ (function () {
    function Vector(x, y, z) {
        this.x = x;
        this.y = y;
        if (z == null) {
            this.z = NaN;
        }
    }
    Vector.prototype.equals = function (v) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    };
    Vector.prototype.toString = function () {
        if (this.z == NaN) {
            return "<" + this.x + ", " + this.y + ">";
        }
        else {
            return "<" + this.x + ", " + this.y + ", " + this.z + ">";
        }
    };
    Vector.prototype.draw = function (context, color) {
        if (color == null) {
            context.fillStyle = 'rgb(20, 20, 20)';
        }
        else {
            context.fillStyle = color;
        }
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.arc(this.x, this.y, 3, 0, Math.PI * 2);
        context.fill();
    };
    return Vector;
}());
var Vector2 = /** @class */ (function (_super) {
    __extends(Vector2, _super);
    function Vector2(x, y) {
        return _super.call(this, x, y) || this;
    }
    Vector2.prototype.add = function (v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    };
    Vector2.prototype.subtract = function (v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    };
    Vector2.prototype.multiply = function (v) {
        return new Vector2(this.x * v.x, this.y * v.y);
    };
    Vector2.prototype.divide = function (v) {
        return new Vector2(this.x / v.x, this.y / v.y);
    };
    Vector2.prototype.unit = function () {
        var l = this.length();
        return new Vector2(this.x / l, this.y / l);
    };
    Vector2.prototype.reverse = function () {
        return new Vector2(-this.x, -this.y);
    };
    Vector2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector2.prototype.cross = function (v) {
        return new Vector3(0, 0, this.x * v.y - this.y * v.x);
    };
    return Vector2;
}(Vector));
var Vector3 = /** @class */ (function (_super) {
    __extends(Vector3, _super);
    function Vector3(x, y, z) {
        return _super.call(this, x, y, z) || this;
    }
    Vector3.prototype.add = function (v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    };
    Vector3.prototype.subtract = function (v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    };
    Vector3.prototype.multiply = function (v) {
        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    };
    Vector3.prototype.divide = function (v) {
        return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
    };
    Vector3.prototype.unit = function () {
        var l = this.length();
        return new Vector3(this.x / l, this.y / l, this.z / l);
    };
    Vector3.prototype.reverse = function () {
        return new Vector3(-this.x, -this.y, -this.z);
    };
    Vector3.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    Vector3.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };
    Vector3.prototype.cross = function (v) {
        throw new Error("Method not implemented.");
    };
    return Vector3;
}(Vector));
/*
    i, j, k: Integers denoting direction vector is going in.

var Vector2 = function(x, y) {
    this.x = x
    this.y = y
}

Vector2.prototype.cosangle = function(v) {
    return this.dot(v) / (this.len() * v.len())
}
Vector2.prototype.angle = function(v) {
    return Math.acos(this.cosangle(v))
}
Vector2.prototype.rotateZ = function(degrees) {
    let rads = degrees / 180 * Math.PI
    let sx = this.x * Math.cos(rads) - this.y * Math.sin(rads)
    let sy = this.x * Math.sin(rads) + this.y * Math.cos(rads)
    return new Vector2(sx, sy)
}
Vector2.prototype.asVector2 = function() {
    return this
}
Vector2.prototype.getVertices = function() {
    return [ this ]
}
*/ 
