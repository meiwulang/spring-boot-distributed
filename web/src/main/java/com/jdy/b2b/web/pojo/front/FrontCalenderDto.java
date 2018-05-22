package com.jdy.b2b.web.pojo.front;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * Created by dugq on 2017/9/21.
 */
public class FrontCalenderDto implements Serializable{
    private static final long serialVersionUID = -2582690325759612129L;
    private int Y;
    private String Y_m_d;
    private String Ymd;
    private String css;
    private int d;
    private Map info;
    private int  m;

    public int getY() {
        return Y;
    }

    public void setY(int y) {
        Y = y;
    }

    public String getY_m_d() {
        return Y_m_d;
    }

    public void setY_m_d(String y_m_d) {
        Y_m_d = y_m_d;
    }

    public String getYmd() {
        return Ymd;
    }

    public void setYmd(String ymd) {
        Ymd = ymd;
    }

    public String getCss() {
        return css;
    }

    public void setCss(String css) {
        this.css = css;
    }

    public int getD() {
        return d;
    }

    public void setD(int d) {
        this.d = d;
    }

    public Map getInfo() {
        return info;
    }

    public void setInfo(Map info) {
        this.info = info;
    }

    public int getM() {
        return m;
    }

    public void setM(int m) {
        this.m = m;
    }
}
