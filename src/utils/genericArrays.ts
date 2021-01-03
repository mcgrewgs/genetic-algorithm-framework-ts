export function IndexOf<T>(
    ts: T[],
    t: T,
    equalsFunc: (t1: T, t2: T) => boolean = (t1: T, t2: T) => t1 === t2
): number {
    for (let i = 0; i < ts.length; i++) {
        if (equalsFunc(ts[i], t)) {
            return i;
        }
    }
    return -1;
}

export function Contains<T>(
    ts: T[],
    t: T,
    equalsFunc: (t1: T, t2: T) => boolean = (t1: T, t2: T) => t1 === t2
): boolean {
    return IndexOf(ts, t, equalsFunc) != -1;
}

export function Equals<T>(
    ts1: T[],
    ts2: T[],
    equalsFunc: (t1: T, t2: T) => boolean = (t1: T, t2: T) => t1 === t2
): boolean {
    if (ts1.length != ts2.length) {
        return false;
    }

    for (let i = 0; i < ts1.length; i++) {
        if (!equalsFunc(ts1[i], ts2[i])) {
            return false;
        }
    }

    return true;
}
