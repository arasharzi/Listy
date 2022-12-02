package com.example.demo.services;

import java.util.List;
import java.util.Optional;

public interface IBasicService<T>
{
    List<T> getAll();
    Optional<T> getById(Long id);
    T save(T t);
    String deleteById(Long id);
}
