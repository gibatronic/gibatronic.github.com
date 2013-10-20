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
        window.setTimeout(callback, 1000 / 30 >> 0);
      }
    }
  }

  // system

  window.system = function() {
    if (document.createElement("canvas").getContext) {
      system.mesh();
      system.icons();

      window.requestAnimationFrame(system.animate);
    }
  }

  system.ratio = window.devicePixelRatio || 1;

  system.animate = function() {
    system.icons.animate();
    system.mesh.animate();

    window.requestAnimationFrame(system.animate);
  }

  system.icons = function() {
    var adjustX,
        adjustY,
        context,
        height,
        panel = document.getElementsByClassName("panel-about")[0],
        section,
        sections,
        width;

    system.icons.canvas = document.createElement("canvas");

    width = panel.offsetWidth;
    height = panel.offsetHeight;

    system.icons.context = context = system.icons.canvas.getContext("2d");
    system.icons.context.scale(system.ratio, system.ratio);

    system.icons.canvas.width = width * system.ratio;
    system.icons.canvas.height = height * system.ratio;

    panel.insertBefore(system.icons.canvas, panel.firstChild);

    sections = panel.querySelectorAll("[class|='section']");

    for (section = 0; section < sections.length; section += 1) {
      system.icons.sections.push(new system.icons.Section({
        element: sections[section]
      }));
    }

    for (section = 0; section < system.icons.sections.length - 1; section += 1) {
      system.icons.sections[section].setConnection(system.icons.sections[section + 1]);
    }
  }

  system.icons.canvas = null;
  system.icons.context = null;
  system.icons.lineWidth = 1;
  system.icons.sections = [ ];
  system.icons.radius = 10;
  system.icons.speed = 0.002;
  system.icons.vertices = [ ];

  system.icons.animate = function() {
    var section = 0,
        sections = system.icons.sections.length;

    system.icons.context.clearRect(0, 0, system.icons.canvas.width, system.icons.canvas.height);

    for (section = 0; section < sections; section += 1) {
      system.icons.sections[section].render();
    }
  }

  system.icons.Section = function(options) {
    var style = window.getComputedStyle(options.element);

    this.element = options.element;
    this.icon = String.fromCharCode(this.element.getAttribute("data-icon"));

    this.x = this.element.offsetLeft + window.parseInt(style["padding-left"]);
    this.y = this.element.offsetTop + window.parseInt(style["padding-top"]);
    this.w = this.element.offsetWidth;
    this.h = this.element.offsetHeight;
  }

  system.icons.Section.prototype.render = function() {
    var context = system.icons.context,
        index,
        now = Date.now() * system.icons.speed;

    context.fillStyle = "rgb(52, 52, 54)";
    context.font = (32 * system.ratio) + "px FontAwesome";
    context.lineWidth = 1;
    context.strokeStyle = "rgb(52, 52, 54)";
    context.textAlign = "center";
    context.textBaseline = "middle";

    if (this.connection) {
      context.save();
      context.beginPath();
      context.moveTo((this.x - 51) * system.ratio, (this.y + 28) * system.ratio);

      for (index = 0; index < this.vertices.length; index += 1) {
        var vertex = this.vertices[index];

        vertex.x = vertex.original.x + (Math.sin(now * vertex.time) * system.icons.radius * vertex.xRange);
        vertex.y = vertex.original.y + (Math.cos(now * vertex.time) * system.icons.radius * vertex.yRange);

        context.lineTo((vertex.x - 51) * system.ratio, (vertex.y + 28) * system.ratio);
      }

      context.lineTo((this.connection.x - 51) * system.ratio, (this.connection.y + 28) * system.ratio);
      context.stroke();
      context.restore();
    }

    context.fillStyle = "rgb(52, 52, 54)";

    context.save();
    context.beginPath();
    context.translate((this.x - 93) * system.ratio, (this.y - 14) * system.ratio);
    context.arc(42 * system.ratio, 42 * system.ratio, 32 * system.ratio, 0, 2 * Math.PI, false);
    context.fill();
    context.restore();

    context.fillStyle = "rgb(42, 42, 43)";

    context.save();
    context.beginPath();
    context.translate((this.x - 93) * system.ratio, (this.y - 14) * system.ratio);
    context.arc(42 * system.ratio, 42 * system.ratio, 32 * system.ratio, 0, 2 * Math.PI, false);
    context.clip();
    context.beginPath();
    context.translate(2 * system.ratio, 2 * system.ratio);
    context.moveTo(0, 42 * system.ratio);
    context.lineTo(10 * system.ratio, 42 * system.ratio);
    context.arc(42 * system.ratio, 42 * system.ratio, 32 * system.ratio, Math.PI, 2 * Math.PI, false);
    context.lineTo(84 * system.ratio, 42 * system.ratio);
    context.lineTo(84 * system.ratio, 0);
    context.lineTo(0, 0);
    context.lineTo(0, 42 * system.ratio);
    context.moveTo(0, 42 * system.ratio);
    context.lineTo(10 * system.ratio, 42 * system.ratio);
    context.arc(42 * system.ratio, 42 * system.ratio, 32 * system.ratio, Math.PI, 2 * Math.PI, true);
    context.lineTo(84 * system.ratio, 42 * system.ratio);
    context.lineTo(84 * system.ratio, 82 * system.ratio);
    context.lineTo(0, 82 * system.ratio);
    context.lineTo(0, 42 * system.ratio);
    context.fill();
    context.restore();

    context.save();
    context.beginPath();
    context.translate((this.x - 51) * system.ratio, (this.y + 28) * system.ratio);
    context.arc(0, 0, 32 * system.ratio, 0, 2 * Math.PI, false);
    context.clip();

    context.fillStyle = "rgb(42, 42, 43)";

    for (var i = 0; i < 32; i += 1) {
      context.fillText(this.icon, i * system.ratio, i * system.ratio);
    }

    context.fillStyle = "rgb(235, 183, 67)";

    context.fillText(this.icon, 0, 0);
    context.restore();

    return this;
  }

  system.icons.Section.prototype.setConnection = function(section) {
    var d,
        dx,
        dy,
        vertice,
        vertices;

    this.connection = section;
    this.vertices = [ ];

    dx = this.connection.x - this.x;
    dy = this.connection.y - this.y;
    d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) >> 0;

    vertices = Math.max(1, d / 100 >> 0) + 1;

    for (vertice = 1; vertice < vertices; vertice += 1) {
      this.vertices.push(new system.Vertex({
        x: this.x + ((dx * vertice) / vertices),
        y: this.y + ((dy * vertice) / vertices)
      }));
    }

    return this;
  }

  system.mesh = function() {
    var adjustX,
        adjustY,
        column,
        columns,
        height,
        panel = document.getElementsByClassName("panel-header")[0],
        row,
        rows,
        width;

    system.mesh.canvas = document.createElement("canvas");

    width = panel.offsetWidth;
    height = panel.offsetHeight;

    columns = Math.ceil(width / system.mesh.width);
    rows = Math.ceil(height / system.mesh.height);

    adjustX = (width - (columns * system.mesh.width)) >> 1;
    adjustY = (height - (rows * system.mesh.height)) >> 1;

    system.mesh.context = system.mesh.canvas.getContext("2d");
    system.mesh.context.scale(system.ratio, system.ratio);

    system.mesh.canvas.width = width * system.ratio;
    system.mesh.canvas.height = height * system.ratio;

    panel.insertBefore(system.mesh.canvas, panel.firstChild);

    for (row = 0; row <= rows; row += 1) {
      system.mesh.vertices[row] = [ ];

      for (column = 0; column <= columns; column += 1) {
        var vertex = new system.Vertex({
          x: ((column * system.mesh.width) + adjustX) * system.ratio,
          y: ((row * system.mesh.height) + adjustY) * system.ratio
        });

        system.mesh.vertices[row][column] = vertex;
      }
    }
  }

  system.mesh.canvas = null;
  system.mesh.context = null;
  system.mesh.height = 100;
  system.mesh.lineWidth = 1;
  system.mesh.radius = 20;
  system.mesh.speed = 0.002;
  system.mesh.strokeOpacity = 0;
  system.mesh.strokeStyle = "rgba(204, 204, 204, 0)";
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
  }

  system.Vertex = function(options) {
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
