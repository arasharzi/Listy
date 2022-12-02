package com.example.demo.config;


import io.jsonwebtoken.Claims;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;


public class AuthenticationFilter extends OncePerRequestFilter
{
    private TokenProvider tokenProvider;
    private static Logger log = LoggerFactory.getLogger(AuthenticationFilter.class);

    public AuthenticationFilter(TokenProvider tokenProvider)
    {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException
    {
        // TODO log.info("INFO : AuthenticationFilter : doFilterInternal");
        String token = request.getHeader("Authorization");
        if (token != null)
        {
            try
            {
                Claims claims = tokenProvider.getClaimsFromToken(token.split(" ")[1].trim());
                if (!claims.getExpiration().before(new Date()))
                {
                    Authentication authentication = tokenProvider.getAuthentication(claims.getSubject());
                    if (authentication.isAuthenticated())
                    {
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            }
            catch (RuntimeException e)
            {
                try
                {
                    SecurityContextHolder.clearContext();
                    response.setContentType("application/json");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().println(new JSONObject().put("exception", "Expired or invalid token."));
                    log.warn("WARN : Expired of invalid token : " + e.getMessage());
                }
                catch (IOException | JSONException e1)
                {
                    e1.printStackTrace();
                }
                return;
            }
        }
        else
        {
            // TODO log.info("INFO : Creating token using UserResourceImpl - authenticate method");
        }
        filterChain.doFilter(request, response);
    }
}
