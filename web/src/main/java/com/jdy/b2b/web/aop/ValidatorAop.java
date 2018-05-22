package com.jdy.b2b.web.aop;

import com.jdy.b2b.web.annotation.MyValidator;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindException;
import org.springframework.validation.ObjectError;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Path;
import javax.validation.Validator;
import javax.validation.constraints.NotNull;
import javax.validation.metadata.ConstraintDescriptor;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.*;


/**
 * Created by dugq on 2017/7/12.
 */
@Aspect
@Configuration
public class ValidatorAop {
    @Autowired
    Validator validator;

    @Pointcut("execution(public * com.jdy.b2b.web.controll..*.*(..))")
    public void validate(){}

    @Before("validate()")
    public void validating(JoinPoint point)throws Throwable{
        Object[] args = point.getArgs();
        Method method = ((MethodSignature) point.getSignature()).getMethod();
        Parameter[] parameters = method.getParameters();
        for(int i = 0 ; i < parameters.length; i++){
            Parameter parameter = parameters[i];
            Object value = args[i];
            Annotation[] annotations = parameter.getAnnotations();
            List<Annotation> list = Arrays.asList(annotations);
            if(isContains(list,MyValidator.class)){
                MyValidator annotation = parameter.getAnnotation(MyValidator.class);
                ValidatorByType(value, annotation);
            }
            else if(isContains(list,NotNull.class)){
                if(Objects.isNull(value)){
                    NotNull annotation1 = parameter.getAnnotation(NotNull.class);
                    ConstraintViolation bindException = new myConstraintViolation(annotation1.message());
                    Set set = new HashSet();
                    set.add(bindException);
                    throw new ConstraintViolationException(set);
                }
            }else if(isContains(list,NotEmpty.class)){
                if(StringUtils.isEmpty(value)){
                    NotEmpty annotation1 = parameter.getAnnotation(NotEmpty.class);
                    ConstraintViolation bindException = new myConstraintViolation(annotation1.message());
                    Set set = new HashSet();
                    set.add(bindException);
                    throw new ConstraintViolationException(set);
                }
            }
        }
    }

    public boolean isContains(List<Annotation> list,Class clazz){
        for(Annotation annotation : list){
            if(annotation.annotationType().equals(clazz)){
                return true;
            }
        }
        return false;
    }


    private void ValidatorByType( Object value, MyValidator annotation) {
        if(Map.class.isAssignableFrom(value.getClass())){
            Map<Object,Object> newValue = (Map<Object,Object>) value;
            for(Map.Entry<Object,Object> entry : newValue.entrySet()){
                Object value1 = entry.getValue();
                if(!value1.getClass().isPrimitive() && !(value1 instanceof String)){
                    validatedUseHibernateValidator(value1, annotation);
                }
            }
        }else if(Collection.class.isAssignableFrom(value.getClass())){
            Collection newValue = (Collection) value;
            Iterator iterator = newValue.iterator();
            while (iterator.hasNext()){
                validatedUseHibernateValidator(iterator.next(), annotation);
            }
        }else{
            validatedUseHibernateValidator(value, annotation);
        }
    }

    private void validatedUseHibernateValidator(Object value, MyValidator annotation) {
        Set<ConstraintViolation<Object>> validate;
        if(annotation.value() == null){
            validate = validator.validate(value, value.getClass());
        }else{
            validate = validator.validate(value, annotation.value());
        }
        if(!CollectionUtils.isEmpty(validate)){
            throw new ConstraintViolationException(validate);
        }
    }

    public class myConstraintViolation implements ConstraintViolation{
        private String message;

        public myConstraintViolation(String message){
            this.message = message;
        }

        @Override
        public String getMessage() {
            return message;
        }

        @Override
        public String getMessageTemplate() {
            return null;
        }

        @Override
        public Object getRootBean() {
            return null;
        }

        @Override
        public Class getRootBeanClass() {
            return null;
        }

        @Override
        public Object getLeafBean() {
            return null;
        }

        @Override
        public Object[] getExecutableParameters() {
            return new Object[0];
        }

        @Override
        public Object getExecutableReturnValue() {
            return null;
        }

        @Override
        public Path getPropertyPath() {
            return null;
        }

        @Override
        public Object getInvalidValue() {
            return null;
        }

        @Override
        public ConstraintDescriptor<?> getConstraintDescriptor() {
            return null;
        }

        @Override
        public Object unwrap(Class type) {
            return null;
        }
    }
}
