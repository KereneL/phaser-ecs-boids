import * as bitEcs from 'bitecs';
import * as Phaser from "phaser";
import { Acceleration, Velocity, Position } from '../components/components';

// Reusable Vectors
var vectorSteer = new Phaser.Math.Vector2()
var vectorDiff = new Phaser.Math.Vector2()
var steerSumForce = new Phaser.Math.Vector2()
var seperationVector = new Phaser.Math.Vector2()
var alignmentVector = new Phaser.Math.Vector2()
var cohesionVector = new Phaser.Math.Vector2()

export function flockSystem(world: any) {
    const { Position, Velocity, Acceleration } = world.components

    const flockQuery = bitEcs.query(world, [Position, Velocity, Acceleration]);
    const boids = Array.from(flockQuery)
    for (const eid of flockQuery) {
        flock(eid, boids)
    }
}

// We accumulate a new acceleration each time based on three rules
function flock(eid: number, boids: number[]) {

    seperationVector.copy(separate(eid, boids));
    alignmentVector.copy(align(eid, boids));
    cohesionVector.copy(cohere(eid, boids));
    
    steerSumForce.reset()
        .add(seperationVector.scale(2))
        .add(alignmentVector.scale(1))
        .add(cohesionVector.scale(1.5))

    Acceleration.vec2[eid].copy(steerSumForce)
}

// Separation
// Method checks for nearby boids and steers away
function separate(eid: number, boids: number[]) {
    vectorSteer.reset()
    let neighborDist = 24.0;
    let countBoids = 0;

    // For every boid in the system, check if it's too close
    boids.forEach(otherBoid => {
        if (otherBoid === eid) return;

        let distance = Position.vec2[eid].distance(Position.vec2[otherBoid]);
        if (distance <= neighborDist) {
            vectorDiff.reset()
            vectorDiff.copy(Position.vec2[eid])
            vectorDiff.subtract(Position.vec2[otherBoid])
            vectorDiff.scale(1 / distance ** 2);

            vectorSteer.add(vectorDiff);
            countBoids++;
        }
    })
    if (countBoids > 0) {
        vectorSteer.scale(1 / countBoids)
            .setLength(Velocity.maxSpeed[eid])
            .limit(Acceleration.maxForce[eid])
    }

    return vectorSteer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
function align(eid: number, boids: number[]) {
    vectorSteer.reset()
    let neighborDist = 25.0;
    let countBoids = 0;

    boids.forEach(otherBoid => {
        if (otherBoid === eid) return;
        let distance = Position.vec2[eid].distance(Position.vec2[otherBoid]);

        if (distance <= neighborDist) {
            vectorSteer.add(Velocity.vec2[otherBoid])
            countBoids++;
        }
    });

    if (countBoids > 0) {
        vectorSteer.scale(1 / countBoids)
            .setLength(Velocity.maxSpeed[eid])
            .limit(Acceleration.maxForce[eid])
    }
    return vectorSteer
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
function cohere(eid: number, otherBoids: number[]) {
    vectorSteer.reset()   // Start with empty vector to accumulate all locations
    let neighborDist = 50.0;
    let countBoids = 0;

    otherBoids.forEach(otherBoid => {
        if (otherBoid === eid) return;
        let distance = Position.vec2[eid].distance(Position.vec2[otherBoid]);

        if (distance <= neighborDist) {
            vectorSteer.add(Position.vec2[otherBoid])
            countBoids++;
        }
    })
    if (countBoids > 0) {
        vectorSteer.scale(1 / countBoids)
            .subtract(Position.vec2[eid])
            .setLength(Velocity.maxSpeed[eid])
            .subtract(Velocity.vec2[eid])
            .limit(Acceleration.maxForce[eid])
    }
    return vectorSteer
}