package com.jdy.b2b.api.common;

/**
 * Created by dugq on 2017/12/4.
 */
public class OneTuple<A> {
    private  A a;

    public OneTuple(A a) {
        this.a = a;
    }

    public A getA() {
        return a;
    }

    public void setA(A a) {
        this.a = a;
    }
}
