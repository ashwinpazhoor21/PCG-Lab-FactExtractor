class Z3Scene extends Phaser.Scene {
    constructor(my) {
        super("z3scene");
        this.my = my;
    }

    init() {
        this.tileSize = 16;
        this.scaleFactor = 1.5;
        this.mapWidth = 40;
        this.mapHeight = 25;
        
    }

    getMapData() {
        // Convert a flat array to a 2D array
        function reshapeTo2DArray(flatArray, width, height) {
            const reshaped = [];
            for (let i = 0; i < height; i++) {
                reshaped.push(flatArray.slice(i * width, (i + 1) * width));
            }
            return reshaped;
        }
    
        const groundLayer = this.groundLayer.getTilesWithin(0, 0, this.mapWidth, this.mapHeight).map(tile => tile.index);
        const treesLayer = this.treesLayer.getTilesWithin(0, 0, this.mapWidth, this.mapHeight).map(tile => tile.index);
        const structuresLayer = this.structuresLayer.getTilesWithin(0, 0, this.mapWidth, this.mapHeight).map(tile => tile.index);
    
        const ground2D = reshapeTo2DArray(groundLayer, this.mapWidth, this.mapHeight);
        const trees2D = reshapeTo2DArray(treesLayer, this.mapWidth, this.mapHeight);
        const structures2D = reshapeTo2DArray(structuresLayer, this.mapWidth, this.mapHeight);
    
        const tileData = {
            tileTypes: {
                1: "normal ground",    // Ground but not walkable
                2: "normal ground",    // Ground but not walkable
                3: "normal ground",    // Ground but not walkable
                4: "tree",             // Tree
                5: "tree",             // Tree
                6: "tree",             // Tree
                7: "tree",             // Tree
                8: "tree",             // Tree
                9: "tree",             // Tree
                10: "tree",            // Tree
                11: "tree",            // Tree
                12: "tree",            // Tree
                13: "path",            // Walkable ground
                14: "path",            // Walkable ground
                15: "path",            // Walkable ground
                16: "tree",            // Tree
                17: "tree",            // Tree
                18: "tree",            // Tree
                19: "tree",            // Tree
                20: "tree",            // Tree
                21: "tree",            // Tree
                22: "tree",            // Tree
                23: "tree",            // Tree
                24: "tree",            // Tree
                25: "path",            // Walkable ground
                26: "path",            // Walkable ground
                27: "path",            // Walkable ground
                28: "tree",            // Tree
                29: "tree",            // Tree
                30: "tree",            // Tree
                31: "tree",            // Tree
                32: "tree",            // Tree
                33: "tree",            // Tree
                34: "tree",            // Tree
                35: "tree",            // Tree
                36: "tree",            // Tree
                37: "path",            // Walkable ground
                38: "path",            // Walkable ground
                39: "path",            // Walkable ground
                40: "path",            // Walkable ground
                41: "path",            // Walkable ground
                42: "path",            // Walkable ground
                43: "path",            // Walkable ground
                44: "path",            // Walkable ground
                45: "fence",           // Fence
                46: "fence",           // Fence
                47: "fence",           // Fence
                48: "fence",           // Fence
                49: "roof",            // Roof
                50: "roof",            // Roof
                51: "roof",            // Roof
                52: "roof",            // Roof
                53: "roof",            // Roof
                54: "roof",            // Roof
                55: "roof",            // Roof
                56: "roof",            // Roof
                57: "fence",           // Fence
                58: "wheelbarrow",     // Wheelbarrow
                59: "fence",           // Fence
                60: "fence",           // Fence
                61: "roof",            // Roof
                62: "roof",            // Roof
                63: "roof",            // Roof
                64: "roof",            // Roof
                65: "roof",            // Roof
                66: "roof",            // Roof
                67: "roof",            // Roof
                68: "roof",            // Roof
                69: "fence",           // Fence
                70: "fence",           // Fence
                71: "fence",           // Fence
                72: "fence",           // Fence
                73: "wall",            // Wall
                74: "wall",            // Wall
                75: "door",            // Door
                76: "wall",            // Wall
                77: "wall",            // Wall
                78: "wall",            // Wall
                79: "door",            // Door
                80: "wall",            // Wall
                81: "fence",           // Fence
                82: "fence",           // Fence
                83: "fence",           // Fence
                84: "sign",            // Sign
                85: "wall",            // Wall
                86: "door",            // Door
                87: "door",            // Door
                88: "door",            // Door
                89: "wall",            // Wall
                90: "door",            // Door
                91: "door",            // Door
                92: "door",            // Door
                93: "object",          // Generic object
                94: "object",          // Generic object
                95: "object",          // Generic object
                96: "object",          // Generic object
                97: "roof",            // Roof
                98: "roof",            // Roof
                99: "roof",            // Roof
                100: "wall",           // Wall
                101: "wall",           // Wall
                102: "wall",           // Wall
                103: "wall",           // Wall
                104: "object",         // Generic object
                105: "object",         // Generic object
                106: "object",         // Generic object
                107: "object",         // Generic object
                108: "object",         // Generic object
                109: "roof",           // Roof
                110: "roof",           // Roof
                111: "roof",           // Roof
                112: "wall",           // Wall
                113: "wall",           // Wall
                114: "wall",           // Wall
                115: "wall",           // Wall
                116: "object",         // Generic object
                117: "object",         // Generic object
                118: "object",         // Generic object
                119: "object",         // Generic object
                120: "object",         // Generic object
                121: "roof",           // Roof
                122: "roof",           // Roof
                123: "roof",           // Roof
                124: "door",           // Door
                125: "door",           // Door
                126: "wall",           // Wall
                127: "wall",           // Wall
                128: "object",         // Generic object
                129: "object",         // Generic object
                130: "object",         // Generic object
                131: "object",         // Generic object
                132: "object"          // Generic object
            },
            layers: {
                ground: ground2D,
                trees: trees2D,
                structures: structures2D
            }
        };  
        return tileData;
    }
    
    async generateConstraintsFromLLM(mapData, ruleDescription) {    
        const prompt = `
        You are generating SMT-LIB constraints for a procedural tilemap system. The tilemap is in phaser, the tilesize is 16, the map width is 40, and the map height is 25. 
        Generate constraints for the following map data, the constraints should lead to a valid solution for the given rules.
        This solution will most likely be used to place objects on the map. Therefore the contraints should consider the coordinates of the tiles and generate solutions for where the new objects could be placed.
        Analyse every layer and learn where the different structures are placed, and what these structures are, this step is extremely important to generate the correct constraints.
        You will get house and fence data from the structures layer, tree and plant data from the trees layer, and ground, and where the walkable paths data from the ground layer.
        All these layers should be considered together based on what the rules are. Try to avoid complicated constraints, but make sure they are correct. 
        Do not make up any functions or variables, based on your assumptions, only use the data provided. It is enough to generate accurate constraints.
        It's crucial you read the map data correctly. The data is in a 2D array format, where each element in the array is a tile ID. The tile ID corresponds to a specific tile type.
        the first element in the first array is the top left corner of the map. The first element in the second array in the row below is the tile to the right of the top left corner, and so on.
        the last element in the last array is the bottom right corner of the map.
        For the map data, the ground layer is on the bottom, the trees layer is in the middle, and the structures layer is on top. The "-1" values just mean that there is no tile at that position.
        this means that you can see the tile, if there is one, on the layer below.
        Use the tile types knowledge along with the layer to identify the structure and layout of the map, with EXACT and accurate coordinates for these structures and objects. 
        
        ### Output Formatting Instructions ###
        Generate **only** valid SMT-LIB constraints. **Do not** include any additional text, explanations, comments, or code fences (e.g., no \`\`\`smtlib\`\`\`). 
        The output must consist solely of raw SMT-LIB constraints formatted for direct parsing by Z3. Respond with no formatting. No  \`\`\` at the start or end.
        
        Here is the current map data:
        
        Tile Types:
        ${JSON.stringify(mapData.tileTypes)}
        
        Ground Layer (2D array of tile IDs):
        ${JSON.stringify(mapData.layers.ground)}

        Trees Layer (2D array of tile IDs):
        ${JSON.stringify(mapData.layers.trees)}
        
        Structures Layer (2D array of tile IDs):
        ${JSON.stringify(mapData.layers.structures)}
        
        Generate SMT-LIB constraints that satisfy the following rules:
        ${ruleDescription} 
        
        Output only valid SMT-LIB constraints. Do not include any additional text, explanations, acknowledgments, or comments. Ensure the constraints are correctly formatted for direct parsing by Z3.
        `;
            // Print the prompt to the console
        // console.log("Generated prompt for queryLLM:", prompt);
        // const constraints = await queryLLM(prompt);
        return prompt;
    }

    async solveSMTLibConstraints(smtlibString) {
        const { Solver, Int, And, Not } = new this.my.Context("main"); // Use the Z3 solver context from the main scene
        const solver = new Solver(); // Create a new solver instance
    
        try {
            solver.fromString(smtlibString); // Load the constraints from the SMT-LIB string
        } catch (error) {
            console.error("Failed to parse constraints:", error); 
            return null;
        }

        const solutions = []; // Store the valid solutions

        while (true) {
            const result = await solver.check(); // Check if there is a solution
    
            if (result === "sat") { // If a solution exists
                const model = solver.model(); // Get the model
                const position = {}; // Store the position
    
                try {
                    // Retrieve the values of 'gen_x' and 'gen_y'
                    const xVar = Int.const("gen_x");
                    const yVar = Int.const("gen_y");
    
                    const xValue = model.eval(xVar);
                    const yValue = model.eval(yVar);
    
                    if (xValue && yValue) {
                        position.gen_x = parseInt(xValue.toString());
                        position.gen_y = parseInt(yValue.toString());
                        solutions.push(position);
    
                        // Exclude the current solution in the next iteration
                        const excludeCurrentSolution = Not(And(
                            xVar.eq(Int.val(position.gen_x)),
                            yVar.eq(Int.val(position.gen_y))
                        ));
                        solver.add(excludeCurrentSolution);
                    } else {
                        console.error("Could not evaluate variables.");
                        break;
                    }
                } catch (error) {
                    console.error("Error evaluating variables:", error);
                    break;
                }
            } else if (result === "unsat") {
                // No more solutions available
                break;
            } else {
                console.warn("Solver returned UNKNOWN.");
                break;
            }
        }

        if (solutions.length > 0) {
            // Pick a random solution from the list
            const randomIndex = Math.floor(Math.random() * solutions.length);
            const randomPosition = solutions[randomIndex];
            // console.log("Random Valid Position Found:", randomPosition);
            return randomPosition;
        } else {
            console.warn("No valid positions found: Constraints are unsatisfiable.");
            return null;
        }
    }


    // Function to query the LLM
    async queryLLM(prompt) {
       
        const completion = await this.my.openai.chat.completions.create({
            model: "o1-preview",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        
        return completion.choices[0].message.content;
    }
    
    
    async create() {
        this.map = this.add.tilemap("three-farmhouses", this.tileSize, this.tileSize, this.mapHeight, this.mapWidth);

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("kenney-tiny-town", "tilemap_tiles");

        // Create layers
        this.groundLayer = this.map.createLayer("Ground-n-Walkways", this.tileset, 0, 0);
        this.treesLayer = this.map.createLayer("Trees-n-Bushes", this.tileset, 0, 0);
        this.structuresLayer = this.map.createLayer("Houses-n-Fences", this.tileset, 0, 0);

        // Camera settings
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(this.scaleFactor);

        const graphics = this.add.graphics();
        const tileSize = this.tileSize;
    
        // Draw grid lines
        graphics.lineStyle(1, 0xaaaaaa, 0.5); // Light gray grid
        for (let x = 0; x <= this.mapWidth; x++) {
            graphics.moveTo(x * tileSize , 0);
            graphics.lineTo(x * tileSize , this.map.heightInPixels);
        }
        for (let y = 0; y <= this.mapHeight; y++) {
            graphics.moveTo(0, y * tileSize );
            graphics.lineTo(this.map.widthInPixels, y * tileSize );
        }
        graphics.strokePath();
    
        // Add axis labels
        for (let x = 0; x < this.mapWidth; x++) {
            const labelX = x * tileSize  + tileSize / 2;
            this.add.text(labelX, 5, `${x}`, { // Adjust Y position to make labels visible
                font: "10px Arial",
                color: "#ffffff",
                backgroundColor: "#000000",
            }).setOrigin(0.5);
        }
        for (let y = 0; y < this.mapHeight; y++) {
            const labelY = y * tileSize  + tileSize / 2;
            this.add.text(5, labelY, `${y}`, { // Adjust X position to make labels visible
                font: "10px Arial",
                color: "#ffffff",
                backgroundColor: "#000000",
            }).setOrigin(0.5);
        }

        // const smtlibString = `
        //     (declare-const gen_x Int)
        //     (declare-const gen_y Int)
        //     (assert (and (>= gen_x 0) (<= gen_x 39)))
        //     (assert (and (>= gen_y 0) (<= gen_y 24)))
        //     (assert (or
        //         (and (>= gen_x 34) (<= gen_x 36) (>= gen_y 3) (<= gen_y 5) (not (and (= gen_x 36) (= gen_y 3))))
        //         (and (>= gen_x 22) (<= gen_x 28) (>= gen_y 18) (<= gen_y 19))
        //     ))
        // `

        // const constraints = '(declare-const gen_x Int) (declare-const gen_y Int) (assert (and (>= gen_x 0) (<= gen_x 39))) (assert (and (>= gen_y 0) (<= gen_y 24))) (define-fun is_tree ((x Int) (y Int)) Bool (or (and (= x 12) (= y 2)) (and (= x 13) (= y 2)) (and (= x 14) (= y 2)) (and (= x 16) (= y 2)) (and (= x 18) (= y 2)) (and (= x 20) (= y 2)) (and (= x 21) (= y 2)) (and (= x 11) (= y 3)) (and (= x 12) (= y 3)) (and (= x 13) (= y 3)) (and (= x 14) (= y 3)) (and (= x 16) (= y 3)) (and (= x 18) (= y 3)) (and (= x 19) (= y 3)) (and (= x 20) (= y 3)) (and (= x 21) (= y 3)) (and (= x 10) (= y 4)) (and (= x 13) (= y 4)) (and (= x 14) (= y 4)) (and (= x 16) (= y 4)) (and (= x 19) (= y 4)) (and (= x 20) (= y 4)) (and (= x 21) (= y 4)) (and (= x 3) (= y 5)) (and (= x 4) (= y 5)) (and (= x 6) (= y 5)) (and (= x 7) (= y 5)) (and (= x 8) (= y 5)) (and (= x 9) (= y 5)) (and (= x 10) (= y 5)) (and (= x 11) (= y 5)) (and (= x 13) (= y 5)) (and (= x 14) (= y 5)) (and (= x 15) (= y 5)) (and (= x 16) (= y 5)) (and (= x 17) (= y 5)) (and (= x 18) (= y 5)) (and (= x 22) (= y 5)) ) ) (define-fun is_occupied ((x Int) (y Int)) Bool (or (is_tree x y) (and (or (and (>= x 3) (<= x 8)) (and (>= x 27) (<= x 38)) ) (and (>= y 2) (<= y 4)) ) ) ) (assert (not (is_occupied gen_x gen_y))) (assert (or (and (< gen_x 39) (is_tree (+ gen_x 1) gen_y)) (and (> gen_x 0) (is_tree (- gen_x 1) gen_y)) (and (< gen_y 24) (is_tree gen_x (+ gen_y 1))) (and (> gen_y 0) (is_tree gen_x (- gen_y 1))) ))'
        // call getMapData() to get the map data
        const mapData = this.getMapData();

        // call generateConstraintsFromLLM() to check query (debug)
        const ruleDescription = 
            `Wheelbarrow INSIDE the fence boundaries(not on the fence itself), there are 2 different fence boundaries on the map, either of these work. Make sure you analyse the layers to fully understand where the fences are on the map, the given data HAS EVERYTHING YOU NEED. Call the generated values gen_x and gen_y for now`;
        
        // const beehiveRuleDescription = 
        //     "Beehive adjacent to any tree, shouldn't be on any other object, or on the tree itself. Call the generated values gen_x and gen_y.";
        
        const prompt = await this.generateConstraintsFromLLM(mapData, ruleDescription);
        
        
        // console.log("Generated prompt for queryLLM:", prompt); //uncomment to show the prompt
        
        // const constraints = await this.queryLLM(prompt); //uncomment to query LLM
        console.log("Received SMT-LIB Constraints:", constraints);

        // Check if constraints were returned
        if (constraints) {
            // Solve constraints
            const validPosition = await this.solveSMTLibConstraints(constraints);

            if (validPosition) {
                console.log("Valid Position:", validPosition);

                // Place the object at the valid position
                this.structuresLayer.putTileAt(58, validPosition.gen_x, validPosition.gen_y); //58 for wheelbarrow, 95 for beehive
            } else {
                console.warn("No valid position for the object was found.");
            }
        } else {
            console.error("Failed to generate constraints from LLM.");
        }
    }
}

