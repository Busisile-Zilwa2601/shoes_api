CREATE table brands(
    id serial not null PRIMARY key, 
    brand_name text not null
);
CREATE table colors(
    id serial not null PRIMARY key, 
    color_name text not null
);
CREATE table shoe_names(
    id serial not null PRIMARY key, 
    name text not null
);
CREATE table sizes(
    id serial not null PRIMARY key, 
    size int
);
CREATE table products(
    id serial not null PRIMARY key, 
    in_stock int,
    prices float,
    brand_id int,
    color_id int,
    shoe_name_id int,
    size_id int,
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (color_id) REFERENCES colors(id),
    FOREIGN KEY (shoe_name_id) REFERENCES shoe_names(id),
    FOREIGN KEY (size_id) REFERENCES sizes(id)
);