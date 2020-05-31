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
      width: terrain.field.width - 25,
      height: terrain.field.height - 25,
      background: "transparent",
      wireframeBackground: "transparent",
      wireframes: false
    }
  });
  engine.world.gravity.y = 0;

  let borders = Composite.create();
  let border_options = {
    isStatic: true,
    collisionFilter: {
      group: 1,
      category: 2,
      mask: 15
    }
  }
  Composite.add(borders, [
    Bodies.rectangle(render.canvas.width/2, 0, render.canvas.width, 5, border_options),
    Bodies.rectangle(0, render.canvas.height/2, 5, render.canvas.height, border_options),
    Bodies.rectangle(render.canvas.width/2, render.canvas.height, render.canvas.width, 5, border_options),
    Bodies.rectangle(render.canvas.width, render.canvas.height/2, 5, render.canvas.height, border_options)
  ]);
  World.add(engine.world, borders);

  let terrain_bodies = Composite.create();
  Events.on(terrain_bodies, "beforeAdd", function(elem) {
    Body.set(elem, {
      frictionAir: 0.1,
      restitution: 0.5,
      collisionFilter: {
        group: 1,
        category: 4,
        mask: 7
      }
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
  let prey_loc = terrain.terrain[Math.floor(Math.random()*terrain.terrain.length)];
  let prey = Bodies.circle(prey_loc.x, prey_loc.y, 10, {
    collisionFilter: {
      group: 0,
      category: 8,
      mask: 3
    }
  }); // sprite
  World.add(engine.world, prey);
  World.add(engine.world, terrain_bodies);

  Engine.run(engine);
  Render.run(render);
});
