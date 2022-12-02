package com.example.demo.services;

import com.example.demo.config.AuthenticationFilter;
import com.example.demo.entities.User;
import com.example.demo.repository.UserRepository;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IBasicService<User>
{
    private static Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAll()
    {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getById(Long id)
    {
        return userRepository.findById(id);
    }

    @Override
    public User save(User user)
    {
        Optional<User> usr = Optional.of(this.userRepository.findByUser(user.getEmail_address()));
        if (usr.isPresent())
        {
            log.info("INFO : Updating the user " + user.getEmail_address());
        }
        else
        {
            log.info("INFO : Adding the user " + user.getEmail_address());
        }
        return userRepository.saveAndFlush(user);
    }

    @Override
    public String deleteById(Long id)
    {
        Optional<User> usr = this.userRepository.findById(id);
        JSONObject result = new JSONObject();
        if (usr.isPresent())
        {
            try
            {
                this.userRepository.deleteById(id);
                log.info("INFO : User: " + usr.get().getEmail_address() + " has been deleted.");
                result.put("message", "User: " + usr.get().getEmail_address() + " has been deleted...");
            }
            catch (JSONException e)
            {log.error("ERROR : " + e.getMessage());}

        }
        return result.toString();
    }
}
