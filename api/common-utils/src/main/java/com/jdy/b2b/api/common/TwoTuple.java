package com.jdy.b2b.api.common;

public class TwoTuple<A,B> extends OneTuple<A>{
    private  B b;

    public TwoTuple(A a,B b) {
        super(a);
        this.b = b;
    }
    public TwoTuple() {
        super(null);
    }

    public B getB() {
        return b;
    }

    public void setB(B b) {
        this.b = b;
    }
}