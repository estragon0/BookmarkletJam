/* global Matter */
/* eslint max-lines-per-function: "off" */
/* eslint max-len: "warn" */
/* eslint object-shorthand: "off" */

$(function() {
  const {
    Engine,
    Render,
    World,
    Bodies,
    Composite,
    Constraint,
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
      category: 0x0010,
      mask: 0x1111
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
  let mc = MouseConstraint.create(
    engine,
    {
      mouse: Mouse.create(render.canvas),
      collisionFilter: {
        mask: 0x11111
      },
      constraint: {
        render: {
          visible: false
        }
      }
    }
  );
  Composite.add(terrain_bodies, mc);
  terrain.terrain.forEach(function (elem) {
    let rect = Bodies.rectangle(elem.x, elem.y, elem.width, elem.height, {
      frictionAir: 0.05, //lower?
      restitution: 0.5,
      collisionFilter: {
        group: 1,
        category: 0x0100,
        mask: 0x0111
      }
    });
    Composite.add(terrain_bodies, rect);
  });

  function selectNewBody() {
    let bodies = Composite.allBodies(terrain_bodies);

    return bodies[Math.floor(Math.random()*bodies.length)];
  }

  let prey_loc = selectNewBody().position;
  //let prey_loc = terrain.terrain[Math.floor(Math.random()*terrain.terrain.length)];
  let prey_body = Bodies.circle(prey_loc.x, prey_loc.y, 5, {
    collisionFilter: {
      group: 0,
      category: 0x1000,
      mask: 0x0011
    }
  }); // sprite
  let prey_sensor = Bodies.circle(prey_loc.x, prey_loc.y, 5, {
    isSensor: true,
    collisionFilter: {
      group: 0,
      category: 0x10000,
      mask: 0x0101
    }
  })
  let prey_constraint = Constraint.create({
    bodyA: prey_body,
    bodyB: prey_sensor,
    pointB: prey_body.position,
    stiffness: 1,
    length: 0
  })
  let prey = Composite.create();
  Composite.add(prey, [
    prey_body,
    prey_sensor,
    prey_constraint
  ]);
  World.add(engine.world, prey);
  World.add(engine.world, terrain_bodies);

  Events.on(engine, "collisionEnd", function() {
    if (event.pairs) {
      event.pairs.forEach(function(p) {
        if (p.bodyA === prey_sensor || p.bodyB === prey_sensor) {
          alert("test");
        }
      })
    }
  })

  Engine.run(engine);
  Render.run(render);
});
