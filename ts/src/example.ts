// eslint-disable-next-line max-classes-per-file
export interface RespondsToAMessage {
  respondsToAMessage: (val: number) => string
}

export interface CollaboratorWithSideEffect {
  thisHasASideEffect: (val: number) => void
}

export class ConcreteClassThatResponds implements RespondsToAMessage {
  respondsToAMessage(val: number): string {
    return `value of ${val}`
  }
}

export class ConcreteClassThatHasASideEffect implements CollaboratorWithSideEffect {
  thisHasASideEffect(/* _val: number */) : void{
    /* no-op, imagine a side effect here */
  }
}

export const theMethodUnderTest: (fn: RespondsToAMessage, x: number) => string = (fn, val) => fn.respondsToAMessage(val)
export const secondMethodUndertest: (fn: CollaboratorWithSideEffect, x: number) => void = (fn, val) => {
  fn.thisHasASideEffect(val)
}
