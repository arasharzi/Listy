package com.example.demo.config;


import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.util.Date;

import com.example.demo.entities.User.Roles;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class TokenProvider
{
    @Autowired
    private UserDetailsService userDetailsService;
    private SecretKey secretKey;

    @PostConstruct
    protected void init()
    {
        secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }

    private long validityInMilliseconds = 60 * 1000 * 10; // 10 minute

    public String createToken(String username, Roles role)
    {
        Claims claims = Jwts.claims().setSubject(username);
        claims.put("auth", role);

        Date now = new Date();
        return Jwts.builder().setClaims(claims).setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + validityInMilliseconds))
                .signWith(secretKey, SignatureAlgorithm.HS256).compact();
    }

    public Authentication getAuthentication(String username)
    {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword(),
                userDetails.getAuthorities());
    }

    public Claims getClaimsFromToken(String token)
    {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
    }
}
