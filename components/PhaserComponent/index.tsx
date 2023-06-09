import React, { useEffect } from "react";
import Phaser from "phaser";

const parentId = "phaser-container";
const colors = [
  0xff0000, 0x0565f5, 0xd505f5, 0xfc8bd3, 0xf21818, 0xebf218, 0x2ef218,
  0x05ffee, 0xff0505, 0xb3b1b5,
];
const width = 800;
const height = 600;

const PhaserComponent = () => {
  useEffect(() => {
    let selectedCircle: Phaser.GameObjects.Arc;
    let originalPosition: { x: number; y: number };

    if (typeof window == "undefined") {
      return;
    }
    
    class MyGame extends Phaser.Scene {
      constructor() {
        super();
      }

      objects: Phaser.GameObjects.Group | undefined = undefined;
      gridSize = 10;
      cellSize = 55;
      startX = (width - this.gridSize * this.cellSize) / 2;
      startY = (600 - this.gridSize * this.cellSize) / 2;

      // checkMatches() {
      //   if (this.objects) {
      //     const allCircles =
      //       this.objects.getChildren() as Phaser.GameObjects.Arc[];
      //     const matchedCircles: Phaser.GameObjects.Arc[][] = [];

      //     for (let i = 0; i < allCircles.length; i++) {
      //       const currentCircle = allCircles[i];
      //       const matched: Phaser.GameObjects.Arc[] = [];

      //       // Check horizontally
      //       let count = 1;
      //       let j = i - 1;
      //       while (
      //         j >= 0 &&
      //         allCircles[j].fillColor === currentCircle.fillColor
      //       ) {
      //         matched.unshift(allCircles[j]);
      //         count++;
      //         j--;
      //       }

      //       matched.push(currentCircle);

      //       j = i + 1;
      //       while (
      //         j < allCircles.length &&
      //         allCircles[j].fillColor === currentCircle.fillColor
      //       ) {
      //         matched.push(allCircles[j]);
      //         count++;
      //         j++;
      //       }

      //       if (count >= 3) {
      //         matchedCircles.push(matched);
      //       }

      //       // Check vertically
      //       matched.length = 0;
      //       count = 1;
      //       j = i - 10;
      //       while (
      //         j >= 0 &&
      //         allCircles[j].fillColor === currentCircle.fillColor
      //       ) {
      //         matched.unshift(allCircles[j]);
      //         count++;
      //         j -= 10;
      //       }

      //       matched.push(currentCircle);

      //       j = i + 10;
      //       while (
      //         j < allCircles.length &&
      //         allCircles[j].fillColor === currentCircle.fillColor
      //       ) {
      //         matched.push(allCircles[j]);
      //         count++;
      //         j += 10;
      //       }

      //       if (count >= 3) {
      //         matchedCircles.push(matched);
      //       }
      //     }

      //     return matchedCircles;
      //   } else return [];
      // }

      removeAndShiftCircles(matchedCircles: Phaser.GameObjects.Arc[][]) {
        if (this.objects) {
          const allCircles =
            this.objects.getChildren() as Phaser.GameObjects.Arc[];

          // Remove matched circles from the grid
          matchedCircles.forEach((matchedGroup) => {
            matchedGroup.forEach((circle) => {
              this.objects && this.objects.remove(circle, true, true);
            });
          });

          // Shift the remaining circles down
          for (let x = 0; x < this.gridSize; x++) {
            const column: Phaser.GameObjects.Arc[] = [];
            for (let y = this.gridSize - 1; y >= 0; y--) {
              const circle = allCircles.find(
                (c) =>
                  c.x === this.startX + x * this.cellSize + this.cellSize / 2 &&
                  c.y === this.startY + y * this.cellSize + this.cellSize / 2
              );

              if (circle) {
                column.unshift(circle);
              }
            }

            column.forEach((circle, index) => {
              circle.y =
                this.startY +
                (this.gridSize - 1 - index) * this.cellSize +
                this.cellSize / 2;
            });
          }

          // Add new circles to fill the empty spaces
          for (let x = 0; x < this.gridSize; x++) {
            const column: Phaser.GameObjects.Arc[] = [];
            for (let y = 0; y < this.gridSize; y++) {
              const circle = allCircles.find(
                (c) =>
                  c.x === this.startX + x * this.cellSize + this.cellSize / 2 &&
                  c.y === this.startY + y * this.cellSize + this.cellSize / 2
              );

              if (!circle) {
                const xPos =
                  this.startX + x * this.cellSize + this.cellSize / 2;
                const yPos =
                  this.startY + y * this.cellSize + this.cellSize / 2;
                const radius = this.cellSize / 2 - 10;

                const newCircle = this.add.circle(
                  xPos,
                  yPos,
                  radius,
                  colors[Math.floor(Math.random() * colors.length)]
                );
                this.objects.add(newCircle);
                column.push(newCircle);
              }
            }

            column.forEach((circle, index) => {
              circle.y =
                this.startY +
                (this.gridSize - 1 - index) * this.cellSize +
                this.cellSize / 2;
            });
          }
        }
      }

      preload() {
        // this.load.image("logo", "/logo.png");
      }

      create() {
        // const logo = this.add.image(400, 150, "logo");

        // Define the grid dimensions
        const gridSize = 10;
        const cellSize = 55;

        // Set the starting position for the grid
        const startX = (800 - gridSize * cellSize) / 2;
        const startY = (600 - gridSize * cellSize) / 2;

        // Create a graphics object
        const graphics = this.add.graphics();

        // Set the line style
        graphics.lineStyle(2, 0xffffff);

        // Draw the verticle grid lines
        for (let x = 0; x <= gridSize; x++) {
          const xPos = startX + x * cellSize;
          graphics.moveTo(xPos, startY);
          graphics.lineTo(xPos, startY + gridSize * cellSize);
        }

        // Draw the horizontal grid lines
        for (let y = 0; y <= gridSize; y++) {
          const yPos = startY + y * cellSize;
          graphics.moveTo(startX, yPos);
          graphics.lineTo(startX + gridSize * cellSize, yPos);
        }

        // Render the grid
        graphics.strokePath();

        // Place objects dynamically in the grid boxes
        const objects = this.add.group();

        // loop for rendering circles in cells
        for (let x = 0; x < gridSize; x++) {
          for (let y = 0; y < gridSize; y++) {
            const xPos = startX + x * cellSize + cellSize / 2;
            const yPos = startY + y * cellSize + cellSize / 2;
            const radius = cellSize / 2 - 10;

            // console.log({ xPos, yPos, radius });

            const object = this.add.circle(
              xPos,
              yPos,
              radius,
              colors[Math.floor(Math.random() * 10)]
            );

            object.setInteractive();
            this.input.setDraggable(object);
            objects.add(object);

            this.objects = objects;

            // console.log(objects);

            this.input.on(
              "dragstart",
              (pointer: any, gameObject: Phaser.GameObjects.Arc) => {
                // console.log(pointer);
                console.log(gameObject.fillColor);
                selectedCircle = gameObject;
                originalPosition = { x: gameObject.x, y: gameObject.y };
              }
            );

            this.input.on(
              "drag",
              (
                pointer: any,
                gameObject: Phaser.GameObjects.Arc,
                dragX: number,
                dragY: number
              ) => {
                gameObject.x = dragX;
                gameObject.y = dragY;
              }
            );

            this.input.on(
              "dragend",
              (pointer: any, gameObject: Phaser.GameObjects.Arc) => {
                const allDots =
                  objects.getChildren() as Phaser.GameObjects.Arc[];

                const droppedCircle = allDots.find((circle) => {
                  return (
                    circle !== selectedCircle &&
                    Phaser.Geom.Rectangle.Contains(
                      circle.getBounds(),
                      pointer.x,
                      pointer.y
                    )
                  );
                });

                // console.log({ droppedCircle: droppedCircle?.fillColor });

                if (droppedCircle) {
                  const droppedPosition = {
                    x: droppedCircle.x,
                    y: droppedCircle.y,
                  };

                  const tempX = droppedCircle.x;
                  const tempY = droppedCircle.y;

                  droppedCircle.x = originalPosition.x;
                  droppedCircle.y = originalPosition.y;

                  gameObject.x = tempX;
                  gameObject.y = tempY;

                  // const matchedCircles = this.checkMatches();

                  // if (matchedCircles.length > 0) {
                  //   // this.removeAndShiftCircles(matchedCircles);
                  // } else {
                  //   // Move the circle back to its original position
                  //   this.tweens.add({
                  //     targets: gameObject,
                  //     x: originalPosition.x,
                  //     y: originalPosition.y,
                  //     duration: 300,
                  //     ease: "Quad.easeInOut",
                  //   });
                  // }
                } else {
                  // Move the circle back to its original position
                  // this.tweens.add({
                  //   targets: selectedCircle,
                  //   x: originalPosition.x,
                  //   y: originalPosition.y,
                  //   duration: 300,
                  //   ease: "Quad.easeInOut",
                  // });
                }
              }
            );
          }
        }
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: parentId,
      width,
      height,
      scene: MyGame,
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id={parentId}></div>;
};

export default PhaserComponent;
