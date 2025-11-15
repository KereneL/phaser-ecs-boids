import * as bitEcs from 'bitecs';
import * as Phaser from "phaser";
import { Acceleration, Velocity, Position } from '../components/components';

const vectorSteer = new Phaser.Math.Vector2(0, 0)
const vectorDiff = new Phaser.Math.Vector2(0,0)

export function flockSystem(world: any) {
    const { Position, Velocity, Acceleration } = world.components

    const flockQuery = bitEcs.query(world, [Position, Velocity, Acceleration]);
    for (const eid of flockQuery) {
        const otherBoids = Array.from(flockQuery)
        const removeIndex = otherBoids.indexOf(eid);
        otherBoids.splice(removeIndex, 1);

        flock(eid, otherBoids)
    }
}

// We accumulate a new acceleration each time based on three rules
function flock(eid: number, otherBoids: number[]) {
    const separatation = separate(eid, otherBoids).scale(1.5);   // Separation
    const alignment = align(eid, otherBoids).scale(1);        // Alignment
    const cohesion = cohere(eid, otherBoids).scale(1);   // Cohesion

    const steerSumForce = new Phaser.Math.Vector2(separatation)
        .add(alignment)
        .add(cohesion)

    Acceleration.vec2[eid].add(steerSumForce)
}

// Separation
// Method checks for nearby boids and steers away
function separate(eid: number, otherBoids: number[]) {
    // let seperateSteer = new Phaser.Math.Vector2(0, 0)
    vectorSteer.set(0,0)
    let desiredSeparation = 10.0;
    let countBoids = 0;

    // For every boid in the system, check if it's too close
    otherBoids.forEach(otherBoid => {
        let distance = Phaser.Math.Distance.BetweenPoints(Position.vec2[eid], Position.vec2[otherBoid]);
        if (distance > 0 && distance <= desiredSeparation) {
            vectorDiff.copy(Position.vec2[eid])
            .subtract(Position.vec2[otherBoid])
            .scale(1 / distance)
            vectorSteer.add(vectorDiff);
            countBoids++;
        }
    })
    if (countBoids > 0) {
        vectorSteer.scale(1 / countBoids)
    }
    return vectorSteer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
function align(eid: number, otherBoids: number[]) {
    vectorSteer.set(0,0)
    let neighborDist = 24 * 3;
    let countBoids = 0;

    otherBoids.forEach(otherBoid => {
        let distance = Phaser.Math.Distance.BetweenPoints(Position.vec2[eid], Position.vec2[otherBoid]);

        if (distance > 0 && distance < neighborDist) {
            vectorSteer.add(Velocity.vec2[otherBoid])
            countBoids++;
        }
    });

    if (countBoids > 0) {
        vectorSteer.scale(1 / countBoids)
    }
    return vectorSteer
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
function cohere(eid: number, otherBoids: number[]) {
    vectorSteer.set(0,0)   // Start with empty vector to accumulate all locations
    let neighborDist = 16 * 3;
    let countBoids = 0;

    otherBoids.forEach(otherBoid => {
        let distance = Phaser.Math.Distance.BetweenPoints(Position.vec2[eid], Position.vec2[otherBoid])

        if (distance > 0 && distance < neighborDist) {
            vectorSteer.add(Position.vec2[otherBoid])
            countBoids++;
        }
    })
    if (countBoids > 0) {
        vectorSteer.scale(1 / countBoids)
    }
    return vectorSteer
}