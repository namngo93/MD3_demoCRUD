const fs = require('fs');
const ProductService = require('../../service/productService');
const categoryService = require('../../service/categoryService');
const qs = require('qs')

class HomeHandleRouter {

    static getHomeHtml(products, homeHtml) {
        let tbody = '';
        products.map((product, index) => {
            tbody += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.description}</td>
                    <td>${product.nameCategory}</td>
                    <td><a href="/edit/${product.id}"><button style="background-color: green; color: white">Sửa</button></a></td>
                    <td><a href="/delete/${product.id}"><button style="background-color: red; color: white">Xóa</button></a></td>
                </tr>`
        })
        homeHtml = homeHtml.replace('{list}', tbody);
        return homeHtml;
    }

    showHome(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/home.html', 'utf-8', async (err, homeHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    let a = await ProductService.findAll();
                    homeHtml = HomeHandleRouter.getHomeHtml(a, homeHtml)
                    res.writeHead(200, 'text/html');
                    res.write(homeHtml);
                    res.end();
                }
            })
        } else {                          // Search bằng tên gần đúng
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    let search = qs.parse(data);
                    fs.readFile('./views/home.html', "utf-8", async (err, indexHtml) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let list = await ProductService.findByName(search.search);
                            console.log(list)
                            indexHtml = HomeHandleRouter.getHomeHtml(list,indexHtml )
                            res.writeHead(200, {'location': '/home'});
                            res.write(indexHtml);
                            res.end();
                        }
                    })

                }
            })
        }
    }

    createProduct(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/create.html', 'utf-8', async (err, createHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    let categories = await categoryService.findAll();
                    let options = '';
                    categories.map(category =>{
                        options += `
                                   <option value=${category.idCategory}>${category.nameCategory}</option>
                                   `
                    })
                    createHtml = createHtml.replace('{categories}',options);
                    res.write(createHtml);
                    res.end();
                }
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', err => {
                if (err) {
                    console.log(err)
                } else {
                    const product = qs.parse(data);
                    ProductService.save(product);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }

    async deleteProduct(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/delete.html', 'utf-8', (err, deleteHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    deleteHtml = deleteHtml.replace('{id}', id);
                    res.write(deleteHtml);
                    res.end();
                }
            })
        } else {
            await ProductService.remove(id);
            res.writeHead(301, {'location': '/home'});
            res.end();
        }
    }

    async editProduct(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/edit.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    let product = await ProductService.findByID(id);
                    editHtml = editHtml.replace('{name}', product[0].name);
                    editHtml = editHtml.replace('{price}', product[0].price);
                    editHtml = editHtml.replace('{description}', product[0].description);
                    editHtml = editHtml.replace('{nameCategory}', product[0].nameCategory);
                    editHtml = editHtml.replace('{id}', id)
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            })
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    const product = qs.parse(data);
                    await ProductService.edit(product, id);
                    console.log(id)
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }
}

module.exports = new HomeHandleRouter();