export class JSUnknown {
    private readonly value: unknown;


    constructor(value: unknown) {
        this.value = value;
    }

    asJSON() {
        return JSON.stringify(this.value);
    }
}
