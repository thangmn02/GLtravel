import React, { useEffect, useRef, useState } from 'react';

// We need to declare the global window.kaboom property if we were using global mode,
// but since we are using global: false, we might not strictly need it on window,
// but the script loading part might still attach it.
declare global {
    interface Window {
        kaboom: any;
    }
}

const GiaLaiAdventure: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // We keep a reference to the kaboom instance to clean it up
    const kRef = useRef<any>(null);

    useEffect(() => {
        // 1. Load Kaboom Script if not present
        const loadKaboom = async () => {
            if (!window.kaboom) {
                const script = document.createElement('script');
                script.src = "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.js";
                script.async = true;
                document.body.appendChild(script);
                await new Promise((resolve) => {
                    script.onload = resolve;
                });
            }
            initGame();
        };

        loadKaboom();

        // 2. Cleanup function
        return () => {
            if (kRef.current) {
                try {
                    kRef.current.quit();
                } catch (e) {
                    console.error("Error quitting kaboom:", e);
                }
            }
        };
    }, []);

    const initGame = () => {
        if (!canvasRef.current || kRef.current) return;

        // Initialize Kaboom
        const k = window.kaboom({
            canvas: canvasRef.current,
            width: 800,
            height: 600,
            background: [135, 206, 235], // Sky blue
            global: false, // Crucial: Do not pollute global namespace
            debug: true,
        });

        kRef.current = k;

        // Load Assets (Multi-Sprite)
        k.loadSprite("hero-idle", "/sprites/hero-idle.png", {
            sliceX: 3, anims: { idle: { from: 0, to: 2, loop: true, speed: 8 } }
        });
        k.loadSprite("hero-run", "/sprites/hero-run.png", {
            sliceX: 3, anims: { run: { from: 0, to: 2, loop: true, speed: 12 } }
        });
        k.loadSprite("hero-attack", "/sprites/hero-attack.png", {
            sliceX: 2, anims: { attack: { from: 0, to: 1, loop: false, speed: 15 } }
        });
        k.loadSprite("hero-defend", "/sprites/hero-defend.png", {
            sliceX: 3, anims: { defend: { from: 0, to: 2, loop: false } }
        });
        k.loadSprite("hero-heal", "/sprites/hero-heal.png", {
            sliceX: 1, anims: { heal: { from: 0, to: 0 } }
        });
        k.loadSprite("hero-death", "/sprites/hero-death.png", {
            sliceX: 2, anims: { death: { from: 0, to: 1, loop: false } }
        });

        // Define Scenes
        k.scene("start", () => {
            k.add([
                k.text("Survival Runner"),
                k.pos(k.center().sub(0, 50)),
                k.anchor("center"),
                k.scale(2),
                k.color(0, 0, 0)
            ]);
            k.add([
                k.text("Space: Attack | Down: Defend | H: Hold to Heal"),
                k.pos(k.center().add(0, 50)),
                k.anchor("center"),
                k.scale(0.8),
                k.color(0, 0, 0)
            ]);
            k.add([
                k.text("Press Space to Start"),
                k.pos(k.center().add(0, 100)),
                k.anchor("center"),
                k.scale(1),
                k.color(0, 0, 0)
            ]);

            k.onKeyPress("space", () => k.go("game"));
            k.onClick(() => k.go("game"));
        });

        k.scene("game", () => {
            // Game State
            let score = 0;
            let hp = 3;
            let gameSpeed = 480;
            let isHealing = false;
            let healTimer = 0;
            const HEAL_TIME = 2; // Seconds to heal

            // Physics
            k.setGravity(1600);

            // Ground
            const ground = k.add([
                k.rect(k.width(), 48),
                k.pos(0, k.height() - 48),
                k.outline(4),
                k.area(),
                k.body({ isStatic: true }),
                k.color(34, 139, 34), // Forest Green
                "ground"
            ]);

            // Player
            // Start with run sprite
            const player = k.add([
                k.sprite("hero-run", { anim: "run" }),
                k.pos(100, k.height() - 80),
                k.area({ scale: 0.8 }), // Adjust hitbox
                k.body(),
                k.scale(0.15), // Adjust visual scale
                k.anchor("center"),
                "player",
                {
                    isAttacking: false,
                    isDefending: false,
                    currentAnim: "run"
                }
            ]);

            // Helper to switch sprite and play animation
            const switchSprite = (animName: string) => {
                if (player.currentAnim === animName) return;

                // Map anim name to sprite name
                const spriteName = "hero-" + animName;
                player.use(k.sprite(spriteName));
                player.play(animName);
                player.currentAnim = animName;
            };

            // UI - Score
            const scoreLabel = k.add([
                k.text("Score: 0"),
                k.pos(24, 24),
                k.fixed(),
                k.color(0, 0, 0)
            ]);

            // UI - Health
            const hpLabel = k.add([
                k.text("HP: " + hp),
                k.pos(24, 64),
                k.fixed(),
                k.color(255, 0, 0)
            ]);

            // UI - Heal Progress
            const healLabel = k.add([
                k.text(""),
                k.pos(k.center().x, k.center().y - 100),
                k.anchor("center"),
                k.color(0, 0, 255),
                k.scale(0.8)
            ]);

            // Controls
            // Attack
            k.onKeyPress("space", () => {
                if (player.isGrounded() && !isHealing && !player.isAttacking) {
                    player.isAttacking = true;
                    switchSprite("attack");

                    // Reset to run after anim
                    player.onAnimEnd((anim: string) => {
                        if (anim === "attack") {
                            player.isAttacking = false;
                            if (!player.isDefending && !isHealing) switchSprite("run");
                        }
                    });
                }
            });

            // Defend
            k.onKeyDown("down", () => {
                if (player.isGrounded() && !isHealing && !player.isAttacking) {
                    if (!player.isDefending) {
                        player.isDefending = true;
                        switchSprite("defend");
                    }
                }
            });

            k.onKeyRelease("down", () => {
                if (player.isDefending) {
                    player.isDefending = false;
                    if (!player.isAttacking && !isHealing) switchSprite("run");
                }
            });

            // Heal (Hold H)
            k.onKeyDown("h", () => {
                if (player.isGrounded() && !player.isAttacking && !player.isDefending) {
                    if (!isHealing) {
                        isHealing = true;
                        gameSpeed = 0; // Stop game movement
                        switchSprite("heal");
                    }

                    healTimer += k.dt();
                    healLabel.text = "Healing... " + Math.ceil(HEAL_TIME - healTimer);

                    if (healTimer >= HEAL_TIME) {
                        if (hp < 3) {
                            hp++;
                            hpLabel.text = "HP: " + hp;
                            k.shake(2);
                            // Visual feedback
                            k.add([
                                k.text("+1 HP"),
                                k.pos(player.pos.sub(0, 50)),
                                k.move(k.UP, 100),
                                k.color(0, 255, 0),
                                k.lifespan(1),
                                k.anchor("center")
                            ]);
                        }
                        healTimer = 0; // Reset timer
                    }
                }
            });

            k.onKeyRelease("h", () => {
                if (isHealing) {
                    isHealing = false;
                    gameSpeed = 480;
                    healTimer = 0;
                    healLabel.text = "";
                    switchSprite("run");
                }
            });


            // Obstacles
            const spawnObstacle = () => {
                if (isHealing) {
                    // Try again later if healing
                    k.wait(0.5, spawnObstacle);
                    return;
                }

                const type = k.choose(["boar", "rock"]);

                if (type === "boar") {
                    k.add([
                        k.text("🐗"),
                        k.area(),
                        k.scale(4),
                        k.pos(k.width(), k.height() - 48 - 24),
                        k.anchor("center"),
                        k.move(k.LEFT, gameSpeed), // Use variable speed
                        "obstacle",
                        "boar"
                    ]);
                } else {
                    k.add([
                        k.text("🪨"),
                        k.area(),
                        k.scale(4),
                        k.pos(k.width(), k.height() - 150), // Higher up
                        k.anchor("center"),
                        k.move(k.LEFT, gameSpeed),
                        "obstacle",
                        "rock"
                    ]);
                }

                k.wait(k.rand(1.5, 3), spawnObstacle);
            };

            spawnObstacle();

            // Update loop
            k.onUpdate(() => {
                if (!isHealing) {
                    score++;
                    scoreLabel.text = "Score: " + score;
                }

                // Update obstacle speeds
                k.get("obstacle").forEach((obj: any) => {
                    obj.move(-gameSpeed, 0);
                });
            });

            // Collision Logic
            player.onCollide("obstacle", (obstacle: any) => {
                let damage = 1;
                let blocked = false;
                let destroyed = false;

                if (isHealing) {
                    damage = 3; // Instant kill/High damage
                    k.shake(20);
                } else if (obstacle.is("boar")) {
                    if (player.isAttacking) {
                        destroyed = true;
                        score += 50;
                        k.shake(5);
                    } else if (player.isDefending) {
                        // Shield break
                        damage = 1;
                        k.shake(5);
                        k.add([
                            k.text("Shield Break!"),
                            k.pos(player.pos.sub(0, 50)),
                            k.scale(0.5),
                            k.color(255, 0, 0),
                            k.lifespan(0.5)
                        ]);
                    } else {
                        // Direct hit
                        damage = 1;
                    }
                } else if (obstacle.is("rock")) {
                    if (player.isDefending) {
                        blocked = true;
                        score += 20;
                    } else if (player.isAttacking) {
                        // Weapon break
                        damage = 1;
                        k.shake(5);
                        k.add([
                            k.text("Weapon Break!"),
                            k.pos(player.pos.sub(0, 50)),
                            k.scale(0.5),
                            k.color(255, 0, 0),
                            k.lifespan(0.5)
                        ]);
                    } else {
                        damage = 1;
                    }
                }

                if (destroyed) {
                    k.destroy(obstacle);
                } else if (blocked) {
                    k.destroy(obstacle);
                    k.add([
                        k.text("Blocked!"),
                        k.pos(player.pos.sub(0, 50)),
                        k.scale(0.5),
                        k.color(0, 0, 255),
                        k.lifespan(0.5)
                    ]);
                } else {
                    // Take Damage
                    hp -= damage;
                    hpLabel.text = "HP: " + hp;
                    k.destroy(obstacle); // Destroy to prevent multiple hits
                    k.shake(10);
                    k.add([
                        k.text("-" + damage + " HP"),
                        k.pos(player.pos.sub(0, 50)),
                        k.move(k.UP, 100),
                        k.color(255, 0, 0),
                        k.lifespan(1),
                        k.anchor("center")
                    ]);

                    if (hp <= 0) {
                        switchSprite("death");
                        k.wait(1, () => {
                            k.go("lose", score);
                        });
                    }
                }
            });
        });

        k.scene("lose", (score: number) => {
            k.add([
                k.text("Game Over"),
                k.pos(k.center()),
                k.anchor("center"),
                k.color(0, 0, 0)
            ]);
            k.add([
                k.text("Final Score: " + score),
                k.pos(k.center().add(0, 64)),
                k.anchor("center"),
                k.scale(0.8),
                k.color(0, 0, 0)
            ]);
            k.add([
                k.text("Press Space to Restart"),
                k.pos(k.center().add(0, 128)),
                k.anchor("center"),
                k.scale(0.6),
                k.color(0, 0, 0)
            ]);

            k.onKeyPress("space", () => k.go("game"));
            k.onClick(() => k.go("game"));
        });

        // Start the game scene
        k.go("start");
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <canvas ref={canvasRef} className="border-4 border-white rounded-lg shadow-lg" />
        </div>
    );
};

export default GiaLaiAdventure;
