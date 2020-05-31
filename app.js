/* global Matter */
/* eslint max-lines-per-function: "off" */
/* eslint max-len: "warn" */

$(function() {
  const {
    Engine,
    Render,
    World,
    Bodies,
    Body,
    Composite,
    Events,
    Mouse,
    MouseConstraint
  } = Matter;
  const terrain =
    JSON.parse(atob(new URLSearchParams(window.location.search).get('terrain')));

  let engine = Engine.create();
  let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: terrain.field.width - 5 ,
      height: terrain.field.height - 5,
      background: "transparent",
      wireframeBackground: "transparent",
      wireframes: false
    }
  });
  engine.world.gravity.y = 0;

  let borders = Composite.create();
  Composite.add(borders, [
    Bodies.rectangle(0, 0, render.canvas.width, 5, {isStatic: true}),
    Bodies.rectangle(0, 0, 5, render.canvas.height, {isStatic: true}),
    Bodies.rectangle(0, render.canvas.height, render.canvas.width, 5, {isStatic: true}),
    Bodies.rectangle(render.canvas.width, 0, 5, render.canvas.height, {isStatic: true})
  ]);
  World.add(engine.world, borders);

  let terrain_bodies = Composite.create();
  Events.on(terrain_bodies, "beforeAdd", function(elem) {
    Body.set(elem, {
      frictionAir: 0.1,
      restitution: 0.5
    })
  });
  let mc = MouseConstraint.create(
    engine,
    {mouse: Mouse.create(render.canvas)}
  );
  Composite.add(terrain_bodies, mc);
  terrain.terrain.forEach(function (elem) {
    let rect = Bodies.rectangle(elem.x, elem.y, elem.width, elem.height);
    Composite.add(terrain_bodies, rect);
  });
  World.add(engine.world, terrain_bodies);

  Engine.run(engine);
  Render.run(render);
});
