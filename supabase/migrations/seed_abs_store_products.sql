-- ABS Store: Seed categories and products
-- Run this AFTER signing up in admin
-- Replace 'YOUR_USER_ID' with your actual user ID from Supabase Auth

-- Insert categories
INSERT INTO categories (id, user_id, name, description, display_order) VALUES
('cat-flores', 'YOUR_USER_ID', 'Flores', 'Ramos frescos y arreglos artesanales', 0),
('cat-libros', 'YOUR_USER_ID', 'Libros', 'Selección curada de autores argentinos y clásicos', 1),
('cat-mate', 'YOUR_USER_ID', 'Mate & Accesorios', 'Mates, bombillas, yerberas y yerba premium', 2),
('cat-argentina', 'YOUR_USER_ID', 'Argentina', 'Camisetas, banderas y piezas culturales', 3),
('cat-regalos', 'YOUR_USER_ID', 'Regalos Especiales', 'Cajas curadas para cada ocasión', 4)
ON CONFLICT DO NOTHING;

-- Insert products
INSERT INTO items (id, user_id, category_id, name, description, price, stock_status) VALUES
-- Flores
('ramo-peonias-blush', 'YOUR_USER_ID', 'cat-flores', 'Ramo de Peonías Blush', 'Ramo artesanal de peonías rosadas con eucalipto fresco. Atado a mano y envuelto en papel kraft con cinta de lino.', 38000, 'in_stock'),
('ramo-girasoles', 'YOUR_USER_ID', 'cat-flores', 'Girasoles del Campo', 'Girasoles luminosos seleccionados a mano. Ideales para alegrar cualquier ambiente.', 22000, 'in_stock'),
('arreglo-jardin-secreto', 'YOUR_USER_ID', 'cat-flores', 'Arreglo Jardín Secreto', 'Composición floral exuberante en caja de madera natural. Una experiencia visual y aromática.', 52000, 'in_stock'),

-- Libros
('el-aleph-borges', 'YOUR_USER_ID', 'cat-libros', 'El Aleph — Jorge Luis Borges', 'Una de las obras maestras de la literatura argentina. Edición conmemorativa con tipografía cuidada.', 18500, 'in_stock'),
('rayuela-cortazar', 'YOUR_USER_ID', 'cat-libros', 'Rayuela — Julio Cortázar', 'La novela que cambió la forma de leer. Edición especial 60 aniversario con prólogo nuevo.', 21000, 'in_stock'),
('martin-fierro', 'YOUR_USER_ID', 'cat-libros', 'Martín Fierro — José Hernández', 'El poema gauchesco argentino por excelencia. Edición ilustrada con notas al pie.', 14000, 'in_stock'),

-- Mate & Accesorios
('mate-calabaza-alpaca', 'YOUR_USER_ID', 'cat-mate', 'Mate Calabaza con Virola de Alpaca', 'Mate tradicional de calabaza con virola y base de alpaca repujada. Listo para usar, curado por nuestros artesanos.', 32000, 'in_stock'),
('set-mate-completo', 'YOUR_USER_ID', 'cat-mate', 'Set Mate Completo', 'Todo lo que necesitás para una buena ronda: mate de calabaza, bombilla de alpaca, yerbera y termo. En caja de madera lista para regalar.', 64000, 'in_stock'),
('yerba-organica-misiones', 'YOUR_USER_ID', 'cat-mate', 'Yerba Orgánica de Misiones 500g', 'Yerba mate orgánica estacionada 24 meses. Sabor suave y aromático, sin agroquímicos.', 8500, 'in_stock'),

-- Argentina
('camiseta-seleccion-3-estrellas', 'YOUR_USER_ID', 'cat-argentina', 'Camiseta Selección Argentina — 3 Estrellas', 'Camiseta titular oficial de la Selección Argentina, edición tres estrellas. Para llevar la celeste y blanca con orgullo.', 145000, 'in_stock'),
('bandera-argentina-bordada', 'YOUR_USER_ID', 'cat-argentina', 'Bandera Argentina Bordada', 'Bandera nacional con Sol de Mayo bordado a mano. Confeccionada en tela de alta resistencia.', 28000, 'in_stock'),
('boina-vasca-tango', 'YOUR_USER_ID', 'cat-argentina', 'Boina del Tango', 'Boina clásica inspirada en el barrio de San Telmo. Tejida a mano en lana natural.', 22000, 'in_stock'),

-- Regalos Especiales
('caja-bienvenido-buenos-aires', 'YOUR_USER_ID', 'cat-regalos', 'Caja Bienvenido a Buenos Aires', 'La introducción perfecta a la cultura argentina: alfajores artesanales, un mate, yerba premium y una edición de Borges. En caja de madera reutilizable.', 78000, 'in_stock'),
('caja-tarde-de-mate', 'YOUR_USER_ID', 'cat-regalos', 'Caja Tarde de Mate', 'Todo lo necesario para una tarde inolvidable: mate completo, yerba orgánica, bizcochitos de grasa y un mantel de algodón.', 56000, 'in_stock'),
('caja-romantica', 'YOUR_USER_ID', 'cat-regalos', 'Caja Romántica', 'Un gesto pensado al detalle: rosas frescas, bombones de chocolate semi-amargo, vela aromática y tarjeta escrita a mano.', 92000, 'in_stock')
ON CONFLICT DO NOTHING;

-- Insert placeholder images for all products
INSERT INTO item_images (item_id, image_url, display_order) VALUES
-- Flores
('ramo-peonias-blush', 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=80', 0),
('ramo-girasoles', 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=900&q=80', 0),
('arreglo-jardin-secreto', 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=900&q=80', 0),

-- Libros
('el-aleph-borges', 'https://images.unsplash.com/photo-1507842217343-583f7270bfed?auto=format&fit=crop&w=900&q=80', 0),
('rayuela-cortazar', 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=900&q=80', 0),
('martin-fierro', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8f?auto=format&fit=crop&w=900&q=80', 0),

-- Mate & Accesorios
('mate-calabaza-alpaca', 'https://images.unsplash.com/photo-1605118898735-43ddc3b8d40c?auto=format&fit=crop&w=900&q=80', 0),
('set-mate-completo', 'https://images.unsplash.com/photo-1599054735388-bcb07bcd9c7c?auto=format&fit=crop&w=900&q=80', 0),
('yerba-organica-misiones', 'https://images.unsplash.com/photo-1585523740635-c41c5e18c112?auto=format&fit=crop&w=900&q=80', 0),

-- Argentina
('camiseta-seleccion-3-estrellas', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', 0),
('bandera-argentina-bordada', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80', 0),
('boina-vasca-tango', 'https://images.unsplash.com/photo-1559056169-641406521c4f?auto=format&fit=crop&w=900&q=80', 0),

-- Regalos Especiales
('caja-bienvenido-buenos-aires', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80', 0),
('caja-tarde-de-mate', 'https://images.unsplash.com/photo-1585523740635-c41c5e18c112?auto=format&fit=crop&w=900&q=80', 0),
('caja-romantica', 'https://images.unsplash.com/photo-1599599810694-b5ac4dd064fd?auto=format&fit=crop&w=900&q=80', 0)
ON CONFLICT DO NOTHING;
