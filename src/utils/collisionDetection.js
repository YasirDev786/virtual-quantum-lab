/**
 * Collision Detection Utilities
 * Handles collision detection and response for physics objects
 */

/**
 * Check if two circles/spheres are colliding
 * @param {Object} obj1 - First object with position and radius
 * @param {Object} obj2 - Second object with position and radius
 * @returns {Object} Collision information
 */
export const checkCircleCollision = (obj1, obj2) => {
  const dx = obj2.position.x - obj1.position.x
  const dy = obj2.position.y - obj1.position.y
  const dz = (obj2.position.z || 0) - (obj1.position.z || 0)
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const minDistance = (obj1.radius || 0.5) + (obj2.radius || 0.5)

  return {
    isColliding: distance < minDistance,
    distance,
    minDistance,
    normal: distance > 0 ? { x: dx / distance, y: dy / distance, z: dz / distance } : { x: 1, y: 0, z: 0 },
    overlap: Math.max(0, minDistance - distance),
  }
}

/**
 * Check if two rectangles/boxes are colliding (AABB)
 * @param {Object} obj1 - First object with position and size
 * @param {Object} obj2 - Second object with position and size
 * @returns {boolean} True if colliding
 */
export const checkBoxCollision = (obj1, obj2) => {
  const size1 = obj1.size || { width: 1, height: 1, depth: 1 }
  const size2 = obj2.size || { width: 1, height: 1, depth: 1 }

  return (
    obj1.position.x < obj2.position.x + size2.width &&
    obj1.position.x + size1.width > obj2.position.x &&
    obj1.position.y < obj2.position.y + size2.height &&
    obj1.position.y + size1.height > obj2.position.y &&
    (obj1.position.z || 0) < (obj2.position.z || 0) + (size2.depth || 1) &&
    (obj1.position.z || 0) + (size1.depth || 1) > (obj2.position.z || 0)
  )
}

/**
 * Check collision between any two objects
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @returns {Object} Collision information
 */
export const checkCollision = (obj1, obj2) => {
  // Determine collision type based on object shapes
  const shape1 = obj1.shape || 'circle'
  const shape2 = obj2.shape || 'circle'

  if (shape1 === 'circle' && shape2 === 'circle') {
    return checkCircleCollision(obj1, obj2)
  } else if (shape1 === 'box' && shape2 === 'box') {
    return {
      isColliding: checkBoxCollision(obj1, obj2),
      distance: 0,
      normal: { x: 0, y: 0, z: 0 },
      overlap: 0,
    }
  } else {
    // Mixed shapes: approximate circle-box collision
    const circle = shape1 === 'circle' ? obj1 : obj2
    const box = shape1 === 'box' ? obj1 : obj2
    const size = box.size || { width: 1, height: 1 }
    
    // Find closest point on box to circle center
    const closestX = Math.max(box.position.x, Math.min(circle.position.x, box.position.x + size.width))
    const closestY = Math.max(box.position.y, Math.min(circle.position.y, box.position.y + size.height))
    const dx = circle.position.x - closestX
    const dy = circle.position.y - closestY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const radius = circle.radius || 0.5

    return {
      isColliding: distance < radius,
      distance,
      normal: distance > 0 ? { x: dx / distance, y: dy / distance, z: 0 } : { x: 1, y: 0, z: 0 },
      overlap: Math.max(0, radius - distance),
    }
  }
}

/**
 * Resolve collision between two objects (elastic collision)
 * @param {Object} obj1 - First object with velocity and mass
 * @param {Object} obj2 - Second object with velocity and mass
 * @param {Object} collision - Collision information from checkCollision
 * @returns {Object} New velocities for both objects
 */
export const resolveCollision = (obj1, obj2, collision) => {
  if (!collision.isColliding) {
    return {
      velocity1: obj1.velocity || { x: 0, y: 0, z: 0 },
      velocity2: obj2.velocity || { x: 0, y: 0, z: 0 },
    }
  }

  const v1 = obj1.velocity || { x: 0, y: 0, z: 0 }
  const v2 = obj2.velocity || { x: 0, y: 0, z: 0 }
  const m1 = obj1.mass || 1
  const m2 = obj2.mass || 1
  const normal = collision.normal

  // Relative velocity
  const rvx = v2.x - v1.x
  const rvy = v2.y - v1.y
  const rvz = (v2.z || 0) - (v1.z || 0)

  // Relative velocity along normal
  const velAlongNormal = rvx * normal.x + rvy * normal.y + rvz * normal.z

  // Don't resolve if velocities are separating
  if (velAlongNormal > 0) {
    return {
      velocity1: v1,
      velocity2: v2,
    }
  }

  // Restitution coefficient (bounciness)
  const e = Math.min(obj1.restitution || 0.8, obj2.restitution || 0.8)

  // Impulse scalar
  const j = -(1 + e) * velAlongNormal / (1 / m1 + 1 / m2)

  // Apply impulse
  const impulse = {
    x: j * normal.x,
    y: j * normal.y,
    z: j * normal.z,
  }

  return {
    velocity1: {
      x: v1.x - impulse.x / m1,
      y: v1.y - impulse.y / m1,
      z: (v1.z || 0) - impulse.z / m1,
    },
    velocity2: {
      x: v2.x + impulse.x / m2,
      y: v2.y + impulse.y / m2,
      z: (v2.z || 0) + impulse.z / m2,
    },
  }
}

/**
 * Check all collisions in an array of objects
 * @param {Array} objects - Array of objects to check
 * @returns {Array} Array of collision pairs
 */
export const checkAllCollisions = (objects) => {
  const collisions = []

  for (let i = 0; i < objects.length; i++) {
    for (let j = i + 1; j < objects.length; j++) {
      const obj1 = objects[i]
      const obj2 = objects[j]

      // Skip if objects don't have collision enabled
      if (obj1.collisionEnabled === false || obj2.collisionEnabled === false) {
        continue
      }

      const collision = checkCollision(obj1, obj2)
      if (collision.isColliding) {
        collisions.push({
          obj1,
          obj2,
          collision,
        })
      }
    }
  }

  return collisions
}

export default {
  checkCircleCollision,
  checkBoxCollision,
  checkCollision,
  resolveCollision,
  checkAllCollisions,
}

