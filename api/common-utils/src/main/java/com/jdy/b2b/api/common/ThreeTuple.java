package com.jdy.b2b.api.common;

/**
 * Created by dugq on 2017/12/6.
 */
public class ThreeTuple<A,B,C> extends TwoTuple<A,B> {
    private C c;
    public ThreeTuple(A a, B b,C c) {
        super(a, b);
        this.c = c;
    }

    public C getC() {
        return c;
    }

    public void setC(C c) {
        this.c = c;
    }
}
