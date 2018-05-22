package com.jdy.b2b.web.config.shiro;

import org.apache.shiro.util.ByteSource;
import org.apache.shiro.util.SimpleByteSource;

import java.io.File;
import java.io.InputStream;
import java.io.Serializable;

/**
 * Created by yangcheng on 2017/7/24.
 */
public class MySimpleByteSource extends SimpleByteSource implements Serializable {
    private static final long serialVersionUID = 1L;

    public MySimpleByteSource(byte[] bytes) {
        super(bytes);
    }


    public MySimpleByteSource(char[] chars) {
        super(chars);
    }

    public MySimpleByteSource(String string) {
        super(string);
    }

    public MySimpleByteSource(ByteSource source) {
        super(source);
    }

    public MySimpleByteSource(File file) {
        super(file);
    }

    public MySimpleByteSource(InputStream stream) {
        super(stream);
    }
}