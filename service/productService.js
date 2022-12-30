const connection = require('../model/connection');
connection.connected()
 class ProductService{
    findAll(){
        let sql= 'select * from product p join category c on c.idCategory = p.idCategory';
        let connect = connection.getConnection()
       return new Promise((resolve, reject) => {
           connect.query(sql, (err, products)=> {
               if (err){
                    reject ( err);
               }else {
                  resolve(products) ;
               }
           })
       })
    }

    findByID(id){
        let connect = connection.getConnection();
        let sql = `select * from product where id = ${id}`;
        return new Promise((resolve,reject) =>{
            connect.query(sql,(err,list) =>{
                if (err){
                    reject (err)
                }else {
                    console.log('Success');
                    resolve(list);
                }
            })
        })
    }

    findByName(name){
        let connect = connection.getConnection();
        let sql = `select * from product p join category c on c.idCategory = p.idCategory where name like '%${name}%'`;
        return new  Promise((resolve,reject) =>{
            connect.query(sql, (err, list) =>{
                if (err){
                    reject(err)
                }else {
                    console.log('Success');
                    resolve(list);
                }
            })
        })
    }

    save(product){
        let connect = connection.getConnection()
            connect.query( `insert into product ( price, name, description, image, idCategory) 
                        values (${product.price}, '${product.name}','${product.description}','abc.ipg', ${product.idCategory})`, (err)=> {
                if (err){
                    console.log(err);
                }
            })
    }

    edit(product, id){
        let connect = connection.getConnection();
        return new Promise((resolve,reject) =>{
            connect.query(`update product
            set name = '${product.name}',
                price = ${product.price},
                description ='${product.description}'
            where id = ${id}`,(err, product) =>{
                if (err){
                    reject(err);
                }else {
                    console.log('Success');
                    resolve(product);
                }
            })
        })
    }

    remove(id){
        let connect = connection.getConnection()
        let sql = `delete from product where id = ${id}`;
        connect.query( sql, (err)=> {
            if (err){
                console.log(err);
            }
        })
    }
}
module.exports =  new ProductService()
