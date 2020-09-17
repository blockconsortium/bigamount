import {BigNumber} from 'bignumber.js';
import {Unit, Units} from "./units";

export class BigAmount {
    private readonly kind = "emerald.BigAmount";

    private readonly value: BigNumber;
    readonly units: Units

    constructor(value: BigNumber | string | number | BigAmount, units: Units) {
        if (typeof value == "undefined") {
            throw Error("Cannot be undefined");
        }
        if (BigAmount.is(value)) {
            this.value = value.value
        } else {
            this.value = new BigNumber(value)
                //ROUND_HALF_DOWN
                .integerValue(5);
        }
        if (this.value.isNaN()) {
            throw new Error("Cannot be NaN");
        }
        if (!Units.is(units)) {
            throw new Error("Not units");
        }
        this.units = units;
    }

    static is(value: any): value is BigAmount {
        return typeof value === 'object'
            && value !== null
            && Object.entries(value).some((a) => a[0] === 'kind' && a[1] === "emerald.BigAmount")
    }

    get number(): BigNumber {
        return this.value;
    }

    getNumberByUnit(unit: Unit): BigNumber {
        if (!this.units.contains(unit)) {
            throw new Error("Wrong unit: " + unit?.toString());
        }
        return this.number.dividedBy(unit.multiplier);
    }

    getOptimalUnit(limit?: Unit): Unit {
        return this.units.getUnit(this, limit);
    }

    toString(): string {
        let unit = this.getOptimalUnit();
        return this.getNumberByUnit(unit).toFixed() + " " + unit.code;
    }

    encode(): string {
        return this.number.toFixed();
    }

    static decode(value: string, units: Units): BigAmount {
        return new BigAmount(value, units);
    }

    equals(o: BigAmount): boolean {
        return BigAmount.is(o) && this.value.eq(o.value) && this.units.equals(o.units);
    }

    isSame(o: BigAmount): boolean {
        return BigAmount.is(o) && this.units.equals(o.units);
    }

    protected requireSame(o: BigAmount) {
        // individual implementation instead of isSame() is just to provide detailed error
        if (!BigAmount.is(o)) {
            throw new Error("Not a BigAmount");
        }
        if (!this.units.equals(o.units)) {
            throw new Error(`Different units. ${this.units.toString()} != ${o.units.toString()}`)
        }
    }

    protected copyWith(value: BigNumber): this {
        // @ts-ignore
        return new BigAmount(
            value,
            this.units
        )
    }

    plus(o: this): this {
        this.requireSame(o);
        return this.copyWith(
            this.value.plus(o.value)
        )
    }

    minus(o: this): this {
        this.requireSame(o);
        return this.copyWith(
            this.value.minus(o.value)
        )
    }

    multiply(n: number | BigNumber): this {
        if (typeof n !== 'number') {
            throw new Error('Not a number')
        }
        return this.copyWith(
            this.value.multipliedBy(n)
        )
    }

    divide(n: number | BigNumber): this {
        if (typeof n !== 'number') {
            throw new Error('Not a number')
        }
        return this.copyWith(
            this.value.dividedBy(n)
                //ROUND_FLOOR
                .integerValue(3)
        )
    }

    isZero(): boolean {
        return this.value.isZero();
    }

    isPositive(): boolean {
        return this.value.isPositive() && !this.isZero();
    }

    isNegative(): boolean {
        return this.value.isNegative();
    }

    isGreaterThan(o: this): boolean {
        this.requireSame(o);
        return this.number.gt(o.number);
    }

    isGreaterOrEqualTo(o: this): boolean {
        this.requireSame(o);
        return this.number.gte(o.number);
    }

    isLessThan(o: this): boolean {
        this.requireSame(o);
        return this.number.lt(o.number);
    }

    isLessOrEqualTo(o: this): boolean {
        this.requireSame(o);
        return this.number.lte(o.number);
    }

    compareTo(o: this): number {
        this.requireSame(o);
        return this.number.comparedTo(o.number);
    }

    max(o: this): this {
        this.requireSame(o);
        if (this.isGreaterOrEqualTo(o)) {
            return this
        } else {
            return o
        }
    }

    min(o: this): this {
        this.requireSame(o);
        if (this.isLessOrEqualTo(o)) {
            return this
        } else {
            return o
        }
    }

}