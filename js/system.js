!function(window, undefined) {
  "use strict";

  // shims

  if (!Date.now) {
    Date.now = function() {
      return new Date().getTime();
    }
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.msRequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback) {
        window.setTimeout(callback, 1000 / 30);
      }
    }
  }

  // system

  window.system = function() {
    system.mesh();
  }

  system.mesh = function() {
    var adjustX,
        adjustY,
        column,
        columns,
        header = document.getElementsByClassName("panel-header")[0],
        height,
        ratio = window.devicePixelRatio || 1,
        row,
        rows,
        width;

    system.mesh.canvas = document.createElement("canvas");

    if (system.mesh.canvas.getContext) {
      width = header.offsetWidth;
      height = header.offsetHeight;

      columns = Math.ceil(width / system.mesh.width);
      rows = Math.ceil(height / system.mesh.height);

      adjustX = (width - (columns * system.mesh.width)) >> 1;
      adjustY = (height - (rows * system.mesh.height)) >> 1;

      system.mesh.context = system.mesh.canvas.getContext("2d");
      system.mesh.context.scale(ratio, ratio);

      system.mesh.canvas.width = width * ratio;
      system.mesh.canvas.height = height * ratio;

      header.insertBefore(system.mesh.canvas, header.firstChild);

      for (row = 0; row <= rows; row += 1) {
        system.mesh.vertices[row] = [ ];

        for (column = 0; column <= columns; column += 1) {
          var vertex = new system.mesh.Vertex({
            x: ((column * system.mesh.width) + adjustX) * ratio,
            y: ((row * system.mesh.height) + adjustY) * ratio
          });

          system.mesh.vertices[row][column] = vertex;
        }
      }

      window.requestAnimationFrame(system.mesh.animate);
    }
  }

  system.mesh.canvas = null;
  system.mesh.context = null;
  system.mesh.height = 100;
  system.mesh.lineWidth = 1;
  system.mesh.radius = 20;
  system.mesh.speed = 0.002;
  system.mesh.strokeOpacity = 0;
  system.mesh.strokeStyle = "rgba(204, 204, 204, " + system.mesh.strokeOpacity + ")";
  system.mesh.vertices = [ ];
  system.mesh.width = 100;

  system.mesh.animate = function() {
    var context = system.mesh.context,
        now = Date.now() * system.mesh.speed,
        row = 0,
        rows = system.mesh.vertices.length;

    context.clearRect(0, 0, system.mesh.canvas.width, system.mesh.canvas.height);
    context.beginPath();

    for (row; row < rows - 1; row += 1) {
      var column = 0,
          columns = system.mesh.vertices[row].length;

      for (column; column < columns - 1; column += 1) {
        var vertex1 = system.mesh.vertices[row][column],
            vertex2 = system.mesh.vertices[row][column + 1],
            vertex3 = system.mesh.vertices[row + 1][column];

        vertex1.x = vertex1.original.x + (Math.sin(now * vertex1.time) * system.mesh.radius * vertex1.xRange);
        vertex1.y = vertex1.original.y + (Math.cos(now * vertex1.time) * system.mesh.radius * vertex1.yRange);

        context.moveTo(vertex1.x, vertex1.y);
        context.lineTo(vertex2.x, vertex2.y);
        context.lineTo(vertex3.x, vertex3.y);
        context.lineTo(vertex1.x, vertex1.y);
      }
    }

    if (system.mesh.strokeOpacity < 1) {
      system.mesh.strokeOpacity += 0.05;
      system.mesh.strokeStyle = "rgba(204, 204, 204, " + system.mesh.strokeOpacity + ")";
    }

    context.lineWidth = system.mesh.lineWidth;
    context.strokeStyle = system.mesh.strokeStyle;
    context.stroke();

    window.requestAnimationFrame(system.mesh.animate);
  }

  system.mesh.Vertex = function(options) {
    this.x = options.x || 0;
    this.y = options.y || 0;

    this.original = {
      x: this.x,
      y: this.y
    }

    this.time = 1 + Math.random();
    this.xRange = 0.5 + (Math.random() * 1.25);
    this.yRange = 0.5 + (Math.random() * 1.25);
  }

  window.onload = system;
}(window);
