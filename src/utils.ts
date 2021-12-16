// Apply Object.keys on possibly undefined objects. Returns undefined if so
export const NullableObjectKeys = <T>(o?: T): string[] | undefined => o ? Object.keys(o) : undefined
