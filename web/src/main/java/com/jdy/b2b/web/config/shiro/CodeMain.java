package com.jdy.b2b.web.config.shiro;

import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.SimpleHash;

/**
 * Created by yangcheng on 2017/6/28.
 */
public class CodeMain {
    public static void main(String[] args) {
        String algorithmName = "md5";
        String username = "13186990179";
        String password = "9361";
        int hashIterations = 3;
        SimpleHash hash = new SimpleHash(algorithmName, password,username, hashIterations);

        String encodedPassword = hash.toHex();
        System.out.println(encodedPassword);
    }
}
