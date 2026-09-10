package com.faldren.security;

import com.faldren.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.util.Date;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;


    private SecretKey getSigningKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(jwtSecret);

        return Keys.hmacShaKeyFor(keyBytes);
    }


    public String generateToken(User user) {

        Date now = new Date();

        Date expiry =
                new Date(
                        now.getTime()
                        + jwtExpiration
                );

        return Jwts
                .builder()
                .subject(user.getEmail())
                .claim(
                        "role",
                        user.getRole().name()
                )
                .claim(
                        "name",
                        user.getFullName()
                )
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }


    public String extractEmail(String token) {

        return extractClaims(token)
                .getSubject();
    }


    public String extractRole(String token) {

        return extractClaims(token)
                .get(
                        "role",
                        String.class
                );
    }


    public boolean isTokenValid(
            String token
    ) {

        try {

            Claims claims =
                    extractClaims(token);

            return claims
                    .getExpiration()
                    .after(new Date());

        } catch (Exception exception) {

            return false;
        }
    }


    private Claims extractClaims(
            String token
    ) {

        return Jwts
                .parser()
                .verifyWith(
                        getSigningKey()
                )
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}