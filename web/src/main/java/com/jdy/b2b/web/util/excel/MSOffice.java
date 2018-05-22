package com.jdy.b2b.web.util.excel;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;


public interface MSOffice<T> {

    T read(InputStream is, boolean isXlsx);

    <A> List<A> read(InputStream is, boolean isXlsx, Class<A> clazz);

    <A> List<A> read(File excelFile, Class<A> clazz);

    boolean write(T t, OutputStream outputStream);

    boolean write(List<?> list, Class<?> clazz, OutputStream outputStream);

    boolean close();
}
