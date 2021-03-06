package self.edu.shopbiz.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import self.edu.shopbiz.exceptionUtil.ResourceNotFoundException;
import self.edu.shopbiz.model.Category;
import self.edu.shopbiz.repository.CategoryRepository;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.List;

/**
 * Created by mpjoshi on 10/31/19.
 */

//(origins = "http://localhost:4200")
@RestController
@RequestMapping("/categories")
public class CategoryController {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories;
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        Category save = categoryRepository.save(category);
        return save;
    }

    @GetMapping("/{id}")
    public @ResponseBody Category getCategoryById(@PathVariable("id") Integer id, HttpServletResponse response) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);
        return category;
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable("id") Integer categoryId, @Valid @RequestBody Category category) {
        if(!categoryId.equals(category.getId())) {
            throw new ResourceNotFoundException(categoryId.longValue());
        }
        return categoryRepository.save(category);
    }



}
