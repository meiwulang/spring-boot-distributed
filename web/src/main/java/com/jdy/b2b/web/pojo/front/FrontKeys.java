package com.jdy.b2b.web.pojo.front;

import java.io.Serializable;

/**
 * Created by dugq on 2017/9/20.
 */
public class FrontKeys implements Serializable{
    private static final long serialVersionUID = -5846854679294498396L;

    private String pk_bgcolor;
    private String pk_color;
    private String pk_name;

    public FrontKeys() {
    }

    public FrontKeys(String pk_bgcolor, String pk_color, String pk_name) {
        this.pk_bgcolor = pk_bgcolor;
        this.pk_color = pk_color;
        this.pk_name = pk_name;
    }

    public String getPk_bgcolor() {
        return pk_bgcolor;
    }

    public void setPk_bgcolor(String pk_bgcolor) {
        this.pk_bgcolor = pk_bgcolor;
    }

    public String getPk_color() {
        return pk_color;
    }

    public void setPk_color(String pk_color) {
        this.pk_color = pk_color;
    }

    public String getPk_name() {
        return pk_name;
    }

    public void setPk_name(String pk_name) {
        this.pk_name = pk_name;
    }
}
