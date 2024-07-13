import { cubicBezier, EasingFunction } from "./easing";


export interface HealthBarConfig {
    duration: number;
    easingFunction: EasingFunction;
    updateCallback: (showHealth: number) => void;
}

const defaultConfig: HealthBarConfig = {
    duration: 1,
    easingFunction: cubicBezier(.33, .57, .21, 1.0),
    updateCallback: (_: number) => { }
};

export class HealthBar {
    private health: number;
    private prevHealth: number;
    private t: number;
    private config: HealthBarConfig;

    constructor(maxHealth: number, config?: Partial<HealthBarConfig>) {
        this.health = maxHealth;
        this.prevHealth = maxHealth;
        this.t = 2;
        this.config = { ...defaultConfig, ...config };
    }

    public decreaseHealth(amount: number): void {
        this.setHealth(this.health - amount);
    }

    public increaseHealth(amount: number): void {
        this.setHealth(this.health + amount);
    }

    public getHealth(): number {
        return this.health;
    }

    public getPrevHealth(): number {
        return this.prevHealth;
    }

    public getShowHealth(): number {
        return this.getEasingValue();
    }

    public updateConfig(config: Partial<HealthBarConfig>): void {
        this.config = { ...this.config, ...config };
    }

    public setHealth(health: number): void {
        this.prevHealth = this.getEasingValue();
        this.health = health;
        this.checkAnimationComplete();
    }

    public hardSetHealth(health: number): void {
        this.prevHealth = health;
        this.health = health;
        this.t = 2;
    }

    public update(deltaTime: number): void {
        if (this.isAnimationComplete()) {
            this.prevHealth = this.health;
        }
        this.t += deltaTime / this.config.duration;
        this.t = Math.min(this.t, 1);
        this.config.updateCallback(this.getEasingValue());
    }

    public isAnimationComplete(): boolean {
        return this.t >= 1;
    }

    private getEasingValue(): number {
        if (this.isAnimationComplete()) {
            return this.health;
        }
        return this.config.easingFunction(this.t) * (this.health - this.prevHealth) + this.prevHealth;
    }

    private checkAnimationComplete(): void {
        if (Math.abs(this.health - this.prevHealth) < 1e-5) {
            this.t = 2;
        } else {
            this.t = 0;
        }
    }
}