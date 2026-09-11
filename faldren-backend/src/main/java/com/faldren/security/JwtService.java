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

    private static final String ISSUER =
            "FALDREN";

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;


    // ==========================================
    // SIGNING KEY
    // ==========================================

    private SecretKey getSigningKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(
                        jwtSecret
                );

        return Keys.hmacShaKeyFor(
                keyBytes
        );
    }


    // ==========================================
    // GENERATE TOKEN
    // ==========================================

    public String generateToken(
            User user
    ) {

        Date now =
                new Date();

        Date expiry =
                new Date(
                        now.getTime()
                        + jwtExpiration
                );


        return Jwts
                .builder()

                .issuer(
                        ISSUER
                )

                .subject(
                        user.getEmail()
                )

                .claim(
                        "role",
                        user.getRole()
                                .name()
                )

                .claim(
                        "name",
                        user.getFullName()
                )

                .issuedAt(
                        now
                )

                .expiration(
                        expiry
                )

                .signWith(
                        getSigningKey()
                )

                .compact();
    }


    // ==========================================
    // EXTRACT EMAIL
    // ==========================================

    public String extractEmail(
            String token
    ) {

        return extractClaims(
                token
        ).getSubject();
    }


    // ==========================================
    // EXTRACT ROLE
    // ==========================================

    public String extractRole(
            String token
    ) {

        return extractClaims(
                token
        ).get(
                "role",
                String.class
        );
    }


    // ==========================================
    // VALIDATE TOKEN
    // ==========================================

    public boolean isTokenValid(
            String token
    ) {

        try {

            Claims claims =
                    extractClaims(
                            token
                    );


            String subject =
                    claims.getSubject();

            Date issuedAt =
                    claims.getIssuedAt();

            Date expiration =
                    claims.getExpiration();

            Date now =
                    new Date();


            if (
                    subject == null
                    ||
                    subject.isBlank()
            ) {

                return false;
            }


            if (
                    issuedAt == null
                    ||
                    issuedAt.after(now)
            ) {

                return false;
            }


            if (
                    expiration == null
                    ||
                    !expiration.after(now)
            ) {

                return false;
            }


            return true;


        } catch (Exception exception) {

            return false;
        }
    }


    // ==========================================
    // PARSE + VERIFY JWT
    // ==========================================

    private Claims extractClaims(
            String token
    ) {

        return Jwts
                .parser()

                .verifyWith(
                        getSigningKey()
                )

                .requireIssuer(
                        ISSUER
                )

                .build()

                .parseSignedClaims(
                        token
                )

                .getPayload();
    }
}