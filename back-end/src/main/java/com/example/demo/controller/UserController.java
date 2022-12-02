package com.example.demo.controller;

import com.example.demo.config.TokenProvider;
import com.example.demo.entities.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.services.IBasicService;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController
{
    private static Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private IBasicService<User> userService;

    @GetMapping("/{id}")
    public User getUser(@PathVariable String id)
    {
        try
        {
            return userService.getById(Long.parseLong(id)).get();
        }
        catch(NumberFormatException e)
        {
            return null;
        }

    }

    @PostMapping("/")
    public ResponseEntity<String> createUser(@PathVariable User user)
    {
        log.info("INFO : Creating account for user  " + user.getEmail_address() + ".");
        JSONObject result = new JSONObject();
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        user.setRoles(User.Roles.USER);
        try
        {
            Optional<User> usr = Optional.of(userRepository.findByUser(user.getEmail_address()));
            if (usr.isPresent())
            {
                result.put("message", "Account already exists.");
                return new ResponseEntity<String>(result.toString(), HttpStatus.OK);
            }
            userService.save(user);
            result.put("message", "Account created for " + user.getEmail_address());
            log.info("INFO : Account successfully created for " + user.getEmail_address());
            return new ResponseEntity<String>(result.toString(), HttpStatus.OK);
        }
        catch(JSONException e)
        {
            try
            {
                result.put("exception", e.getMessage());
            }
            catch (JSONException e1)
            {
                e1.printStackTrace();
            }
        }
        log.info("INFO : Unable to create account for " + user.getEmail_address());
        return new ResponseEntity<String>(result.toString(), HttpStatus.UNAUTHORIZED);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable String id)
    {
        return null;
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable String id)
    {
        return "";
    }

    @PostMapping("/auth")
    public ResponseEntity<String> auth(@RequestBody User user)
    {
        log.info("INFO : User " + user.getEmail_address() + " attempting to login...");
        JSONObject result = new JSONObject();
        try
        {
            Authentication auth = authManager.authenticate(new
                    UsernamePasswordAuthenticationToken(user.getEmail_address(), user.getPassword()));
            if (auth.isAuthenticated())
            {
                result.put("name", auth.getName());
                result.put("authorities", auth.getAuthorities());
                result.put("token", tokenProvider.createToken(user.getEmail_address(),
                        userRepository.findByUser(user.getEmail_address()).getRoles()));
                log.info("INFO : User " + user.getEmail_address() + " successfully logged in.");
                return new ResponseEntity<String>(result.toString(), HttpStatus.OK);
            }
        }
        catch (JSONException e)
        {
            log.warn("WARN : Auth json exception " + e.getMessage());
            return new ResponseEntity<String>(result.toString(), HttpStatus.UNAUTHORIZED);
        }
        catch (BadCredentialsException e1)
        {
            log.warn("WARN : Invalid login attempt for user " + user.getEmail_address());
            return new ResponseEntity<String>("{\"error\":\"Invalid login attempt.\"}", HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<String>(result.toString(), HttpStatus.UNAUTHORIZED);
    }
}
