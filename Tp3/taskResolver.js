const { Level } = require('level')

//Creation base des donnes 
const db=new Level('./tasks-db', { valueEncoding: 'json' })

    
const getNextId = async () => {
    const currentId = await db.get('taskIdCounter').catch(() => 0);
    const nextId = Number(currentId) + 1; // Increment the ID
    await db.put('taskIdCounter', nextId); // Update the counter in the database
    return nextId; // Return the next ID
};

const taskResolver = {
    Query: {
        task: async (_, { id }) => {
            const task = await db.get(id)
            return task
        },
        tasks: async () => {
            const tasks = []
            for await (const key of db.keys()) {
                tasks.push(await db.get(key))
            }
            return tasks
        },
        
    },
    Mutation: {
        addTask: async(_, { title, description, completed, duration }) => {
            const id = await getNextId(); // Get the next sequential ID
            const task = {
                id: String(id), // Convert ID to string
                title,
                description,
                completed,
                duration,
            };
            await db.put(task.id, task); // Store the task in the database
            return task;
        },
        completeTask:async (_, { id }) => {
            const task = await db.get(id);
            if(task){
                task.completed = true;
                await db.put(id, task);
                return task;
            }
            return null;
        },
        changeDescription: async (_, { id, description }) => {
            const task = await db.get(id);
            if(task){
                task.description = description;
                await db.put(id, task);
                return task;
            }
            return null;
        },
        deleteTask: async(_, { id }) => {
            const task = await db.get(id);
            if(task){
                await db.del(id);
                return task;
            }
            return null;
        }
    },
};
module.exports = taskResolver;