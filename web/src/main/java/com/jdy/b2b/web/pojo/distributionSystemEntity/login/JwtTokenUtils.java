package com.jdy.b2b.web.pojo.distributionSystemEntity.login;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>jwt token工具类</p>
 * <pre>
 *     jwt的claim里一般包含以下几种数据:
 *         1. iss -- token的发行者
 *         2. sub -- 该JWT所面向的用户
 *         3. aud -- 接收该JWT的一方
 *         4. exp -- token的失效时间
 *         5. nbf -- 在此时间段之前,不会被处理
 *         6. iat -- jwt发布时间
 *         7. jti -- jwt唯一标识,防止重复使用
 * </pre>
 */
public class JwtTokenUtils {
	private static final String ISSUER = "sp-order-center";

	// 生成token
	public static String createJWT(String subject, Map<String, Object> claims) {

		//The JWT signature algorithm we will be using to sign the token
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

		long nowMillis = System.currentTimeMillis();
		Date now = new Date(nowMillis);

		//We will sign our JWT with our ApiKey secret
		//byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(apiKey.getSecret());
		byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(JwtProperties.secret);
		Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());

		  //Let's set the JWT Claims
		JwtBuilder builder = Jwts.builder()
				.setClaims(claims)
				.setSubject(subject)
				.setIssuer(ISSUER)
				.setIssuedAt(now)
				.signWith(signatureAlgorithm, signingKey);

		 //if it has been specified, let's add the expiration
		if (JwtProperties.expiration >= 0) {
		    long expMillis = nowMillis + JwtProperties.expiration*1000;
		    Date exp = new Date(expMillis);
		    builder.setExpiration(exp);
		}

		 //Builds the JWT and serializes it to a compact, URL-safe string
		return builder.compact();
	}

	public static String createJWT(JwtUser user) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("uid", user.getUid());
		claims.put("openId", user.getOpenId());
		claims.put("deptId", user.getDeptId());
		claims.put("deptName", user.getDeptName());
		claims.put("orgId", user.getOrgId());
		claims.put("orgName", user.getOrgName());
		claims.put("createDate", user.getCreateDate());
		claims.put("contactId",user.getContactId());
		claims.put("contactName",user.getContactName());
		claims.put("isOrg",user.getIsOrg());
		claims.put("isAgent",user.getIsAgent());
		claims.put("parentName",user.getParentName());
		claims.put("positionId",user.getPositionId());
		claims.put("headImg",user.getHeadImg());
		claims.put("wxWithdrawOpenId",user.getWxWithdrawOpenId());
		return createJWT(user.getUsername(), claims);
	}
	
	/**
	 * 解析验证token，获取jwt的payload部分
	 * @param token
	 * @return
	 */
	private static Claims getClaimsFromToken(String token) {
		Claims claims;
		try {
			claims = Jwts.parser()
					.setSigningKey(JwtProperties.secret)
					.parseClaimsJws(token)
					.getBody();
		} catch (Exception e) {
			claims = null;
		}
		return claims;
	}

	public static JwtUser getUserFromToken(String token) {
		JwtUser user = null;
		try {
			final Claims claims = getClaimsFromToken(token);
			user = new JwtUser();
			user.setUsername(claims.getSubject());
			user.setUid(Long.parseLong(claims.get("uid").toString()));
			user.setOpenId(String.valueOf(claims.get("openId")));
			user.setDeptId(claims.get("deptId") != null ? Long.parseLong(claims.get("deptId").toString()) : 0);
			user.setDeptName(String.valueOf(claims.get("deptName")));
			user.setOrgId(claims.get("orgId") != null ? Long.parseLong(claims.get("orgId").toString()) : 0);
			user.setOrgName(String.valueOf(claims.get("orgName")));
			user.setCreateDate(String.valueOf(claims.get("createDate")));
			user.setContactId(claims.get("contactId") != null ? Long.parseLong(claims.get("contactId").toString()) : 0);
			user.setPositionId(String.valueOf(claims.get("positionId").toString()));
			user.setContactName(String.valueOf(claims.get("contactName")));
			user.setIsOrg(Integer.parseInt(claims.get("isOrg").toString()));
			user.setIsAgent(Integer.parseInt(claims.get("isAgent").toString()));
			user.setParentName(String.valueOf(claims.get("parentName")));
			user.setHeadImg(String.valueOf(claims.get("headImg")));
			user.setWxWithdrawOpenId(String.valueOf(claims.get("wxWithdrawOpenId")));
			user.setPhone(String.valueOf(claims.get("phone")));
		} catch (Exception e) {
			user = null;
		}
		return user;
	}
	
	private static Date generateExpirationDate() {
        return new Date(System.currentTimeMillis() + JwtProperties.expiration * 1000);
    }
	
	private static String generateToken(Claims claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(generateExpirationDate())
                .signWith(SignatureAlgorithm.HS512, JwtProperties.secret)
                .compact();
    }
	
	public static String refreshToken(String token) {
        String refreshedToken;
        try {
            final Claims claims = getClaimsFromToken(token);
            claims.setIssuedAt(new Date());
            refreshedToken = generateToken(claims);
        } catch (Exception e) {
            refreshedToken = null;
        }
        return refreshedToken;
    }

}
