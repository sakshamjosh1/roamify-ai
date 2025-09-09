import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const CreateNewUser=mutation({
    args:{
        name:v.string(),
        email:v.string(),
        imageUrl:v.string(),
    },
    handler:async(ctx,args)=>{
        //If user already exists
        const user=await ctx.db.query('UserTable')
        .filter((q)=>q.eq(q.field('email'), args.email))
        .collect();

        if(user?.length==0){
            const userData = {
                name:args.name,
                email:args.email,
                imageUrl:args.imageUrl
            }
            //If not then Create new user
            const result=await ctx.db.insert('UserTable', userData);
            return userData;
        }

        return user[0];

    }
})