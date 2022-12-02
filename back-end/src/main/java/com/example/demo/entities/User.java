package com.example.demo.entities;

import javax.persistence.*;
import java.util.Set;


@Entity
public class User
{
    public enum Roles
    {
        ADMIN,
        USER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private  long id;

    @Column(nullable = false)
    private String email_address;
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Roles role;

    private String first_name;
    private String last_name;



    public long getId()
    {
        return id;
    }
    public void setId(long id)
    {
        this.id = id;
    }

    public String getEmail_address()
    {
        return email_address;
    }
    public void setEmail_address(String email_address)
    {
        this.email_address = email_address;
    }

    public String getPassword()
    {
        return password;
    }
    public void setPassword(String password)
    {
        this.password = password;
    }

    public Roles getRoles()
    {
        return role;
    }
    public void setRoles(Roles role)
    {
        this.role = role;
    }

    public String getFirst_name() {
        return first_name;
    }
    public void setFirst_name(String first_name)
    {
        this.first_name = first_name;
    }

    public String getLast_name()
    {
        return last_name;
    }
    public void setLast_name(String last_name)
    {
        this.last_name = last_name;
    }
}
