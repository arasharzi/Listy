package com.example.demo.services;

import com.example.demo.entities.User;
import com.example.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class UserAuthService implements UserDetailsService
{
    @Autowired
    UserRepository userRepository;
    private static Logger log = LoggerFactory.getLogger(UserAuthService.class);

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        User user = userRepository.findByUser(username);
        if (user == null)
        {
            log.warn("WARN : User " + username + " not found.");
        }

        return new org.springframework.security.core.userdetails.User(user.getEmail_address(), user.getPassword(),
                getGrantedAuthority(user));
    }

    private Collection<GrantedAuthority> getGrantedAuthority(User user)
    {
        Collection<GrantedAuthority> authorities = new ArrayList();

        if (user.getRoles().equals(User.Roles.ADMIN))
        {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        else if (user.getRoles().equals(User.Roles.USER))
        {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }
        return authorities;
    }
}
