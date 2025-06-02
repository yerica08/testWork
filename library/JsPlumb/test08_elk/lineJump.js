// lineJump.js

function startLineJumpLoop() {
   function update() {
      const allPaths = Array.from(
         document.querySelectorAll('.jtk-connector path')
      ).map((path) => {
         const connector = path.closest('.jtk-connector');
         const svg = path.ownerSVGElement;

         const connectorRect = connector.getBoundingClientRect();
         const svgRect = svg.getBoundingClientRect();

         const offsetX = connectorRect.left - svgRect.left;
         const offsetY = connectorRect.top - svgRect.top;

         return {
            pathElement: path,
            d: path.getAttribute('d'),
            segments: parsePath(path.getAttribute('d')),
            originalD: path.getAttribute('d'),
            offsetX,
            offsetY,
         };
      });

      for (let i = 0; i < allPaths.length; i++) {
         const pathA = allPaths[i];
         for (let j = i + 1; j < allPaths.length; j++) {
            const pathB = allPaths[j];

            let intersectionPoint = null;

            for (let k = 0; k < pathA.segments.length - 1; k++) {
               const a1 = pathA.segments[k].coords;
               const a2 = pathA.segments[k + 1].coords;

               for (let l = 0; l < pathB.segments.length - 1; l++) {
                  const b1 = pathB.segments[l].coords;
                  const b2 = pathB.segments[l + 1].coords;

                  const a1Abs = getAbsoluteCoords(a1, pathA);
                  const a2Abs = getAbsoluteCoords(a2, pathA);
                  const b1Abs = getAbsoluteCoords(b1, pathB);
                  const b2Abs = getAbsoluteCoords(b2, pathB);

                  const intersection = lineIntersect(
                     a1Abs,
                     a2Abs,
                     b1Abs,
                     b2Abs
                  );

                  if (intersection) {
                     intersectionPoint = intersection;
                  }
               }
            }

            if (intersectionPoint) {
               const gap = 12;
               splitPath(pathA, intersectionPoint, gap);
               splitPath(pathB, intersectionPoint, gap);
            } else {
               pathA.pathElement.setAttribute('d', pathA.originalD);
               pathB.pathElement.setAttribute('d', pathB.originalD);
            }
         }
      }

      requestAnimationFrame(update);
   }

   requestAnimationFrame(update);
}

function parsePath(d) {
   if (!d) {
      console.warn('⚠️ parsePath: empty d!');
      return [];
   }

   const commands = d.match(/[ML][^ML]*/g);
   if (!commands) {
      console.warn(`⚠️ parsePath: failed to parse d="${d}"`);
      return [];
   }

   return commands.map((cmd) => {
      const type = cmd[0];
      const coords = cmd.slice(1).trim().split(/[ ,]+/).map(Number);

      if (coords.some(isNaN)) {
         console.warn(`⚠️ parsePath: NaN detected in coords:`, coords);
      }

      return { type, coords };
   });
}

function getAbsoluteCoords(segment, pathObj) {
   const x = segment[0];
   const y = segment[1];

   const absX = x + pathObj.offsetX;
   const absY = y + pathObj.offsetY;

   return [absX, absY];
}

function lineIntersect(p1, p2, p3, p4) {
   const x1 = p1[0],
      y1 = p1[1];
   const x2 = p2[0],
      y2 = p2[1];
   const x3 = p3[0],
      y3 = p3[1];
   const x4 = p4[0],
      y4 = p4[1];

   const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
   if (denom === 0) return null;

   const intersectX =
      ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
      denom;
   const intersectY =
      ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
      denom;

   const tolerance = 1;

   const inside =
      isBetween(x1, x2, intersectX, tolerance) &&
      isBetween(y1, y2, intersectY, tolerance) &&
      isBetween(x3, x4, intersectX, tolerance) &&
      isBetween(y3, y4, intersectY, tolerance);
   if (inside) {
      return { x: intersectX, y: intersectY };
   }

   return null;
}

function isBetween(a, b, c, tolerance = 0) {
   return (
      (a - tolerance <= c && c <= b + tolerance) ||
      (b - tolerance <= c && c <= a + tolerance)
   );
}

function clamp(value, min, max) {
   return Math.max(min, Math.min(max, value));
}

function splitPath(pathObj, intersectionPoint, gap) {
   const segments = pathObj.segments;
   let newD = '';

   let foundIntersection = false;

   for (let i = 0; i < segments.length - 1; i++) {
      const p1 = getAbsoluteCoords(segments[i].coords, pathObj);
      const p2 = getAbsoluteCoords(segments[i + 1].coords, pathObj);

      const intersect = lineIntersect(
         p1,
         p2,
         [intersectionPoint.x - 1, intersectionPoint.y - 1],
         [intersectionPoint.x + 1, intersectionPoint.y + 1]
      );

      if (intersect) {
         foundIntersection = true;

         const dx = p2[0] - p1[0];
         const dy = p2[1] - p1[1];
         const length = Math.sqrt(dx * dx + dy * dy);
         const nx = dx / length;
         const ny = dy / length;

         const halfGap = gap / 2;

         const gapStartX = intersect.x - nx * halfGap;
         const gapStartY = intersect.y - ny * halfGap;
         const gapEndX = intersect.x + nx * halfGap;
         const gapEndY = intersect.y + ny * halfGap;

         const clampedGapStartX = clamp(
            gapStartX,
            Math.min(p1[0], p2[0]),
            Math.max(p1[0], p2[0])
         );
         const clampedGapStartY = clamp(
            gapStartY,
            Math.min(p1[1], p2[1]),
            Math.max(p1[1], p2[1])
         );

         const clampedGapEndX = clamp(
            gapEndX,
            Math.min(p1[0], p2[0]),
            Math.max(p1[0], p2[0])
         );
         const clampedGapEndY = clamp(
            gapEndY,
            Math.min(p1[1], p2[1]),
            Math.max(p1[1], p2[1])
         );

         if (i === 0) {
            newD += `M ${p1[0]},${p1[1]} `;
         }

         newD += `L ${clampedGapStartX},${clampedGapStartY} `;
         newD += `M ${clampedGapEndX},${clampedGapEndY} `;
         newD += `L ${p2[0]},${p2[1]} `;
      } else {
         if (i === 0) {
            newD += `M ${p1[0]},${p1[1]} `;
         }
         newD += `L ${p2[0]},${p2[1]} `;
      }
   }

   if (!foundIntersection) {
      console.log(`❌ No intersection found for this path`);
   }

   pathObj.pathElement.setAttribute('d', newD);
}
