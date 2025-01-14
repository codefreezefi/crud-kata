export class ConcreteClassThatResponds {
    respondsToAMessage(val) {
        return `value of ${val}`;
    }
}
export class ConcreteClassThatHasASideEffect {
    thisHasASideEffect(_val) {
        /* no-op, imagine a side effect here */
    }
}
export const theMethodUnderTest = (fn, val) => fn.respondsToAMessage(val);
export const secondMethodUndertest = (fn, val) => {
    fn.thisHasASideEffect(val);
};
//# sourceMappingURL=example.js.map