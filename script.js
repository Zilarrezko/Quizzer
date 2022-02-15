window.onload = function()
{
   let correct = 0;
   let total = 0;
   let drug_index = 0;
   let question_direction = 0;
   let state = 0;

   function set_question()
   {
      let question = "";
      let unit = by_id("unit").value;
      drug_index = random_int(0, units[unit - 1] - 1);
      let drug = drugs[drug_index];
      drug_index = random_int(0, units[unit - 1] - 1);
      drug = drugs[drug_index];
      
      if(drug.brand.length == 0)
      {
         question_direction = 2;
      }
      else
      {
         question_direction = random_int(0, 3);
      }
      switch(question_direction)
      {
         case 3:
         {
            by_id("text_input").style.display = "none";
            by_id("drop_input").style.display = "block";
            class_dropdown_fill(drug)
            let brand = drug.brand[random_int(0, drug.brand.length - 1)] + "";
            question += "What is a class of " + brand + "?";
         } break;
         case 2:
         {
            by_id("text_input").style.display = "none";
            by_id("drop_input").style.display = "block";
            class_dropdown_fill(drug);

            if(drug.generic.length > 1)
            {
               question += "What is a class of the combination of ";
               for(let i = 0;
                   i < drug.generic.length;
                   ++i)
               {
                  if(i == drug.generic.length - 1)
                  {
                     question += "and " + drug.generic[i];
                  }
                  else
                  {
                     question += drug.generic[i] + ", ";
                  }
               }
               question += "?";
            }
            else
            {
               question += "What is a class of " + drug.generic[0] + "?";
            }
         } break;
         case 1:
         {
            by_id("text_input").style.display = "block";
            by_id("drop_input").style.display = "none";
            let brand = drug.brand[random_int(0, drug.brand.length - 1)] + "";
            question += "What is the generic name(s) of " + brand + "?";
         } break;
         case 0:
         {
            by_id("text_input").style.display = "block";
            by_id("drop_input").style.display = "none";
            if(drug.generic.length > 1)
            {
               question += "What is the brand name(s) of the combination of ";
               for(let i = 0;
                   i < drug.generic.length;
                   ++i)
               {
                  if(i == drug.generic.length - 1)
                  {
                     question += "and " + drug.generic[i];
                  }
                  else
                  {
                     question += drug.generic[i] + ", ";
                  }
               }
               question += "?";
            }
            else
            {
               question += "What is the brand name(s) of " + drug.generic[0] + "?";
            }
         } break;
      }
      by_id("question").innerHTML = question;

      function class_dropdown_fill(drug)
      {
         let drug_class = drug.class[random_int(0, drug.class.length - 1)];
         let placement = random_int(0, 3);
         let dinput = by_id("drop_input");
         for(let i = 0;
             i < 4;
             ++i)
         {
            let class_choice = 0;
            if(i != placement)
            {
               let good = true;
               do
               {
                  class_choice = random_int(0, classes.length - 1);
                  good = true;
                  for(let j = 0;
                      j < drug.class.length;
                      ++j)
                  {
                     for(let k = 0;
                         k < j;
                         ++k)
                     {
                        if(class_choice == dinput.options[i].value)
                        {
                           good = false;
                           break
                        }
                     }
                     if(class_choice == drug.class[j])
                     {
                        good = false;
                     }
                     if(!good) break;
                  }
               } while(!good);
            }
            else
            {
               class_choice = drug_class;
            }
            dinput.options[i].value = class_choice;
            dinput.options[i].innerHTML = classes[class_choice];
         }
      }
   }

   function update_stats()
   {
      let s = "Stats: ";
      if(total != 0)
      {
         s += (100*correct/total).toPrecision(3) + "%";
      }
      by_id("stats").innerHTML = s;
   }

   function evaluate(answer)
   {
      let drug = drugs[drug_index];
      let answers = answer.split(",/;");
      let correct_items = 0;

      switch(question_direction)
      {
         case 3:
         case 2:
         {
            let drug = drugs[drug_index];
            let dinput = by_id("drop_input");
            let correct = false;
            for(let i = 0;
                i < 4;
                ++i)
            {
               if(drug.class[i] == dinput.value)
               {
                  correct = true;
                  break;
               }
            }
            return correct;
         } break;
         case 1:
         {
            return check_helper(drug.generic);
         } break;
         case 0:
         {
            return check_helper(drug.brand);
         } break;
      }

      function check_helper(arr)
      {
         // Todo: Probably should check answers for uniqueness
         for(let i = 0;
             i < answers.length;
             ++i)
         {
            for(let j = 0;
                j < arr.length;
                ++j)
            {
               if(answers[i].toLowerCase().trim() == arr[j].toLowerCase())
               {
                  correct_items += 1;
                  break;
               }
            }
         }

         return correct_items == arr.length && answers.length == arr.length;
      }
   }

   function output_answer()
   {
      let drug = drugs[drug_index];
      let s = "";
      s += "<u>Generic</u>: ";
      s += array_printer(drug.generic, (x) => {return x;});
      s += "<br>";
      s += "<u>Brand</u>: ";
      s += array_printer(drug.brand, (x) => {return x;});
      s += "<br>";
      s += "<u>Class</u>: ";
      s += array_printer(drug.class, (x) => {return classes[x];});
      s += "<br>";
      s += "<u>Notes</u>: " + drug.facts;

      by_id("answer").innerHTML = s;

      function array_printer(arr, func)
      {
         let builder = "";
         for(let i = 0;
             i < arr.length;
             ++i)
         {
            builder += func(arr[i]);
            if(i != arr.length - 1)
            {
               builder += ", ";
            }
         }
         return builder;
      }
   }

   set_question();

   by_id("confirm").onclick = function()
   {
      if(state == 0)
      {
         let input = by_id("text_input");
         let answer = input.value.toLowerCase();
         if(evaluate(answer))
         {
            correct += 1;
            by_id("feedback").innerHTML = "Correct";
         }
         else
         {
            by_id("feedback").innerHTML = "Incorrect";
         }
         total += 1;
         update_stats();
         output_answer();
         by_id("confirm").innerHTML = "NEXT";
         state = 1;
      }
      else
      {
         by_id("text_input").value = "";
         by_id("feedback").innerHTML = "";
         by_id("answer").innerHTML = "";
         by_id("confirm").innerHTML = "CONFIRM";
         set_question();
         state = 0;
      }
   }

   by_id("text_input").onkeydown = function()
   {
      if(event.keyCode == 13)
      {
         by_id("confirm").onclick();
      }
   }

   by_id("unit").onchange = function()
   {
      set_question();
   }
}

let units =
[
   79,  // unit 1
   91,  // unit 2
   112, // unit 3
   124, // unit 4
   133, // unit 5
   150, // unit 6
   187  // unit 7
];

let drugs =
[
   {
      generic:["Albuterol"],
      brand:["ProAir", "Ventolin", "Proventil"],
      class:[0],
      facts:["Available in HFA inhaler and nebulizer solution"],
   },
   {
      generic:["Albuterol", "Ipratropium"],
      brand:["Combivent Respimat", "Duoneb"],
      class:[0, 1],
      facts:[""]
   },
   {
      generic:["Amlodipine"],
      brand:["Norvasc"],
      class:[2, 3],
      facts:[""]
   },
   {
      generic:["Amlodipine", "Benazepril"],
      brand:["Lotrel"],
      class:[2, 3, 4],
      facts:[""]
   },
   {
      generic:["Atenolol"],
      brand:["Tenormin"],
      class:[5],
      facts:[""]
   },
   {
      generic:["Atorvastatin"],
      brand:["Lipitor"],
      class:[6],
      facts:[""]
   },
   {
      generic:["Azelastine"],
      brand:["Astepro"],
      class:[7],
      facts:[""]
   },
   {
      generic:["Beclomethasone"],
      brand:["Qvar"],
      class:[7],
      facts:[""]
   },
   {
      generic:["Benazepril"],
      brand:["Lotensin"],
      class:[4],
      facts:[""]
   },
   {
      generic:["Bisoprolol"],
      brand:["Zebeta", "Monocor"],
      class:[5],
      facts:[""]
   },
   {
      generic:["Bisoprolol", "Hydrochlorothiazide"],
      brand:["Ziac"],
      class:[5, 9],
      facts:[""]
   },
   {
      generic:["Budesonide"],
      brand:["Pulmicort Respules", "Pulmicort Flexhaler"],
      class:[10],
      facts:["Respules = suspension for nebulizer, Flexhaler = inhaler"]
   },
   {
      generic:["Budesonide", "Formoterol"],
      brand:["Symbicort"],
      class:[11],
      facts:[""]
   },
   {
      generic:["Bumetanide"],
      brand:["Bumex"],
      class:[12],
      facts:[""]
   },
   {
      generic:["Carvedilol"],
      brand:["Coreg"],
      class:[33],
      facts:[""]
   },
   {
      generic:["Cetirizine"],
      brand:["Zyrtec"],
      class:[14],
      facts:[""]
   },
   {
      generic:["Chlorthalidone"],
      brand:["Thalitone"],
      class:[9],
      facts:[""]
   },
   {
      generic:["Clonidine"],
      brand:["Catapres", "Kapvay"],
      class:[15],
      facts:["Kapvay = ADHD; Catapres = HTN"]
   },
   {
      generic:["Colesevelam"],
      brand:["Welchol"],
      class:[16],
      facts:[""]
   },
   {
      generic:["Diltiazem"],
      brand:["Cardizem", "Cartia-XT", "Tiazac"],
      class:[17, 3],
      facts:["Pay attention to IR, CD, LA, XR, XT!"]
   },
   {
      generic:["Diphenhydramine"],
      brand:["Benadryl", "ZzzQuil"],
      class:[18],
      facts:[""]
   },
   {
      generic:["Doxazosin"],
      brand:["Cardura"],
      class:[13],
      facts:[""]
   },
   {
      generic:["Enalapril"],
      brand:["Vasotec"],
      class:[4],
      facts:[""]
   },
   {
      generic:["Ezetimibe"],
      brand:["Zetia"],
      class:[19],
      facts:[""]
   },
   {
      generic:["Felodipine"],
      brand:["Plendil"],
      class:[2, 3],
      facts:[""]
   },
   {
      generic:["Fenofibrate"],
      brand:["Lofibra", "Tricor", "Trilipix"],
      class:[20],
      facts:[""]
   },
   {
      generic:["Fexofenadine"],
      brand:["Allegra"],
      class:[14],
      facts:["Available OTC"]
   },
   {
      generic:["Fluticasone (nasal)"],
      brand:["Flonase"],
      class:[21],
      facts:[""]
   },
   {
      generic:["Fluticasone (inhaled)"],
      brand:["Flovent", "ArmonAir Digihaler", "Arnuity Ellipta"],
      class:[21],
      facts:[""]
   },
   {
      generic:["Fluticasone", "Salmeterol"],
      brand:["Advair Diskus", "Advair HFA", "AirDuo RespiClick", "Wixela Inhub"],
      class:[10, 11],
      facts:[""]
   },
   {
      generic:["Fluticasone", "Vilanterol"],
      brand:["Breo Ellipta"],
      class:[10, 11],
      facts:[""]
   },
   {
      generic:["Fosinopril"],
      brand:["Monopril"],
      class:[4],
      facts:[""]
   },
   {
      generic:["Furosemide"],
      brand:["Lasix"],
      class:[12],
      facts:[""]
   },
   {
      generic:["Gemfibrozil"],
      brand:["Lopid"],
      class:[20],
      facts:[""]
   },
   {
      generic:["Hydralazine"],
      brand:["Apresoline"],
      class:[22],
      facts:[""]
   },
   {
      generic:["Hydrochlorothiazide"],
      brand:["Microzide"],
      class:[9],
      facts:[""]
   },
   {
      generic:["Hydrochlorothiazide", "Lisinopril"],
      brand:["Zestoretic"],
      class:[9, 4],
      facts:[""]
   },
   {
      generic:["Hydrochlorothiazide", "Losartan"],
      brand:["Hyzaar"],
      class:[9, 23], // Todo: 23 might not be right.... Ask josh
      facts:[""]
   },
   {
      generic:["Hydroxyzine"],
      brand:["Vistaril", "Atarax"],
      class:[18],
      facts:[""]
   },
   {
      generic:["Ipratropium"],
      brand:["Atrovent"],
      class:[1],
      facts:["Available in HFA inhaler, nebulizer solution, and nasal spray"]
   },
   {
      generic:["Irbesartan"],
      brand:["Avapro"],
      class:[23],
      facts:[""]
   },
   {
      generic:["Labetalol"],
      brand:["Trandate"],
      class:[33, 5],
      facts:[""]
   },
   {
      generic:["Levalbuterol"],
      brand:["Xopenex"],
      class:[0],
      facts:["Available in HFA inhaler and nebulizer solution"]
   },
   {
      generic:["Levocetirizine"],
      brand:["Xyzal"],
      class:[14],
      facts:[""]
   },
   {
      generic:["Lisinopril"],
      brand:["Prinivil", "Zestril"],
      class:[4],
      facts:[""]
   },
   {
      generic:["Loratadine"],
      brand:["Claritin"],
      class:[14],
      facts:["Available OTC"]
   },
   {
      generic:["Losartan"],
      brand:["Cozaar"],
      class:[23],
      facts:[""]
   },
   {
      generic:["Lovastatin"],
      brand:["Mevacor"],
      class:[6],
      facts:[""]
   },
   {
      generic:["Methylprednisolone"],
      brand:["Medrol", "Solu-Medrol", "Depo-Medrol"],
      class:[24],
      facts:["Medrol = tablets; Solu-Medrol = IV/IM injection; Depo-Medrol = IM injection"]
   },
   {
      generic:["Metoprolol"],
      brand:["Lopressor", "Toprol XL"],
      class:[5],
      facts:["Lopressor = metoprolol tartrate (BID); Toprol XL = metoprolol succinate (daily)"]
   },
   {
      generic:["Mometasone"],
      brand:["Nasonex", "Asmanex"],
      class:[10, 21],
      facts:["Nasonex = nasal spray; Asmanex = inhalation"]
   },
   {
      generic:["Montelukast"],
      brand:["Singulair"],
      class:[25],
      facts:[""]
   },
   {
      generic:["Nebivolol"],
      brand:["Bystolic"],
      class:[5],
      facts:[""]
   },
   {
      generic:["Nicotinic Acid"],
      brand:["Niaspan", "Slo-Niacin"],
      class:[26],
      facts:[""]
   },
   {
      generic:["Nifedipine"],
      brand:["Adalat CC", "Procardia XL"],
      class:[2, 3],
      facts:[""]
   },
   {
      generic:["Olmesartan"],
      brand:["Benicar"],
      class:[23],
      facts:[""]
   },
   {
      generic:["Omega-3-acid Ethyl Esters"],
      brand:["Lovaza"],
      class:[27],
      facts:[""]
   },
   {
      generic:["Potassium Chloride"],
      brand:["K-Dur"],
      class:[28],
      facts:[""]
   },
   {
      generic:["Pravastatin"],
      brand:["Pravachol"],
      class:[29],
      facts:[""]
   },
   {
      generic:["Prazosin"],
      brand:["Minipress"],
      class:[13],
      facts:[""]
   },
   {
      generic:["Prednisone"],
      brand:["Prednisone Intensol", "Rayos", "Deltasone"],
      class:[24],
      facts:[""]
   },
   {
      generic:["Promethazine"],
      brand:["Phenergan"],
      class:[18],
      facts:[""]
   },
   {
      generic:["Propranolol"],
      brand:["Inderal"],
      class:[5],
      facts:[""]
   },
   {
      generic:["Quinapril"],
      brand:["Accupril"],
      class:[4],
      facts:[""]
   },
   {
      generic:["Ramipril"],
      brand:["Altace"],
      class:[4],
      facts:[""]
   },
   {
      generic:["Rosuvastatin"],
      brand:["Crestor"],
      class:[29],
      facts:[""]
   },
   {
      generic:["Simvastatin"],
      brand:["Zocor"],
      class:[29],
      facts:[""]
   },
   {
      generic:["Spironolactone"],
      brand:["Aldactone"],
      class:[30],
      facts:[""]
   },
   {
      generic:["Telmisartan"],
      brand:["Micardis"],
      class:[23],
      facts:[""]
   },
   {
      generic:["Terazosin"],
      brand:["Hytrin"],
      class:[13],
      facts:[""]
   },
   {
      generic:["Tiotropium"],
      brand:["Spiriva"],
      class:[31],
      facts:["Handihaler = inhalation capsule; Respimat = aerosol solution"]
   },
   {
      generic:["Torsemide"],
      brand:["Demadex"],
      class:[12],
      facts:[""]
   },
   {
      generic:["Triamcinolone"], // Note: technically should have (intranasal) in it
      brand:["Nasacort"],
      class:[21],
      facts:[""]
   },
   {
      generic:["Triamterene", "Hydrochlorothiazide"],
      brand:["Dyazide", "Maxzide"],
      class:[9, 32],
      facts:[""]
   },
   {
      generic:["Umeclidinium"],
      brand:["Incruse Ellipta"],
      class:[31],
      facts:[""]
   },
   {
      generic:["Umeclidinium", "Vilanterol"],
      brand:["Anoro Ellipta"],
      class:[31, 11],
      facts:[""]
   },
   {
      generic:["Valsartan"],
      brand:["Diovan"],
      class:[23],
      facts:[""]
   },
   {
      generic:["Valsartan", "Hydrochlorothiazide"],
      brand:["Diovan HCT"],
      class:[23, 9],
      facts:[""]
   },
   {
      generic:["Verapamil"],
      brand:["Calan SR", "Verelan PM"],
      class:[17, 3],
      facts:["Pay attention to IR vs. SR vs. PM!"]
   },
   {
      generic:["Canagliflozin"],
      brand:["Invokana"],
      class:[34],
      facts:[""]
   },
   {
      generic:["Dapagliflozin"],
      brand:["Farxiga"],
      class:[34],
      facts:[""]
   },
   {
      generic:["Digoxin"],
      brand:["Digox", "Lanoxin"],
      class:[35],
      facts:[""]
   },
   {
      generic:["Empagliflozin"],
      brand:["Jardiance"],
      class:[35],
      facts:[""]
   },
   {
      generic:["Ibuprofen"],
      brand:["Motrin", "Advil"],
      class:[36],
      facts:["OTC = formulations of 200 mg or less; Rx = formulations > 200 mg"]
   },
   {
      generic:["Indomethacin"],
      brand:["Indocin", "Tivorbex"],
      class:[36],
      facts:[""]
   },
   {
      generic:["Liraglutide"],
      brand:["Victoza", "Saxenda"],
      class:[38],
      facts:["Victoza = T2DM; Saxenda = Obesity"]
   },
   {
      generic:["Nitroglycerin"],
      brand:["Nitro-Dur", "Nitrostat", "Rectiv", "GoNitro"],
      class:[37, 39],
      facts:["Nitrostat, GoNitro = SL tablets; Nitro-Dur = patches; Rectiv = rectal gel"]
   },
   {
      generic:["Phentermine"],
      brand:["Adipex-P"],
      class:[40],
      facts:["Schedule IV controlled substance"]
   },
   {
      generic:["Sacubitril", "Valsartan"],
      brand:["Entresto"],
      class:[41, 23],
      facts:[""]
   },
   {
      generic:["Semaglutide"],
      brand:["Ozempic", "Rybelsus", "Wegovy"],
      class:[38],
      facts:["Ozempic = injectable for DM; Rybelsus = oral for DM; Wegovy = injectable for overweight/obesity"]
   },
   {
      generic:["Dulaglutide"],
      brand:["Trulicity"],
      class:[38],
      facts:[""]
   },
   {
      generic:["Exenatide"],
      brand:["Byetta", "Bydureon"],
      class:[38],
      facts:["Byetta = BID injections; Bydureon = weekly"]
   },
   {
      generic:["Glimepiride"],
      brand:["Amaryl"],
      class:[42],
      facts:[""]
   },
   {
      generic:["Glipizide"],
      brand:["Glucotrol"],
      class:[42],
      facts:[""]
   },
   {
      generic:["Glyburide"],
      brand:["Diabeta"],
      class:[42],
      facts:[""]
   },
   {
      generic:["Insulin Aspart"],
      brand:["Novolog", "Fiasp"],
      class:[43],
      facts:["Novolog = rapid-acting; Fiasp = ultra-rapid acting"]
   },
   {
      generic:["Insulin Degludec"],
      brand:["Tresiba"],
      class:[43],
      facts:[""]
   },
   {
      generic:["Insulin Detemir"],
      brand:["Levemir"],
      class:[43],
      facts:[""]
   },
   {
      generic:["Insulin Glargine"],
      brand:["Lantus", "Basaglar", "Semglee", "Rezvoglar", "Toujeo"],
      class:[43],
      facts:["Toujeo = 300 units/mL; All others = 100 units/mL"]
   },
   {
      generic:["Insulin Lispro"],
      brand:["Admelog", "Humalog"],
      class:[43],
      facts:[""]
   },
   {
      generic:["Insulin Regular", "Insulin Isophane (NPH)"],
      brand:["Novolin 70/30", "Humulin 70/30"], // Todo: This is weird... Ask Josh what these should be?
      class:[44],
      facts:[""]
   },
   {
      generic:["Insulin Regular"],
      brand:["Humulin R", "Novolin R"], // Todo: This one is weird too
      class:[43],
      facts:[""]
   },
   {
      generic:["Linagliptin"],
      brand:["Tradjenta"],
      class:[45],
      facts:[""]
   },
   {
      generic:["Metformin"],
      brand:["Glucophage"],
      class:[46],
      facts:[""]
   },
   {
      generic:["Metformin", "Sitagliptin"],
      brand:["Janumet"],
      class:[45, 46],
      facts:[""]
   },
   {
      generic:["NPH Insulin"],
      brand:["Humulin N", "Novolin N"],
      class:[44],
      facts:[""]
   },
   {
      generic:["Pioglitazone"],
      brand:["Actos"],
      class:[47],
      facts:[""]
   },
   {
      generic:["Repaglinide"],
      brand:["Prandin"],
      class:[48],
      facts:[""]
   },
   {
      generic:["Rosiglitazone"],
      brand:["Avandia"],
      class:[47],
      facts:[""]
   },
   {
      generic:["Saxaglitpin"],
      brand:["Onglyza"],
      class:[45],
      facts:[""]
   },
   {
      generic:["Sitagliptin"],
      brand:["Januvia"],
      class:[45],
      facts:[""]
   },
   {
      generic:["Apixaban"],
      brand:["Eliquis"],
      class:[50],
      facts:[""]
   },
   { // Todo: Anything special we should do for no brands?
      generic:["Aspirin"],
      brand:[],
      class:[51],
      facts:[""]
   },
   {
      generic:["Clopidogrel"],
      brand:["Plavix"],
      class:[52],
      facts:[""]
   },
   {
      generic:["Dabigatran"],
      brand:["Pradaxa"],
      class:[53],
      facts:[""]
   },
   {
      generic:["Edoxaban"],
      brand:["Savaysa"],
      class:[50],
      facts:[""]
   },
   {
      generic:["Enoxaparin"],
      brand:["Lovenox"],
      class:[54],
      facts:[""]
   },
   {
      generic:["Prasugrel"],
      brand:["Effient"],
      class:[52],
      facts:[""]
   },
   {
      generic:["Ranolazine"],
      brand:["Ranexa"],
      class:[55],
      facts:[""]
   },
   {
      generic:["Rivaroxaban"],
      brand:["Xarelto"],
      class:[50],
      facts:[""]
   },
   {
      generic:["Ticagrelor"],
      brand:["Brilinta"],
      class:[52],
      facts:[""]
   },
   {
      generic:["Warfarin"],
      brand:["Coumadin"],
      class:[56],
      facts:[""]
   },
   {
      generic:["Unfractionated Heparin"],
      brand:[],
      class:[57],
      facts:[""]
   },
   {
      generic:["Amiodarone"],
      brand:["Pacerone"],
      class:[58],
      facts:[""]
   },
   {
      generic:["Cyanocobalamin"],
      brand:["Vitamin B12"],
      class:[59],
      facts:[""]
   },
   {
      generic:["Darbepoetin alfa"],
      brand:["Aranesp"],
      class:[60],
      facts:[""]
   },
   {
      generic:["Epoetin alfa"],
      brand:["Epogen", "Procrit", "Retacrit"],
      class:[60],
      facts:[""]
   },
   {
      generic:["Flecainide"],
      brand:["Tambocor"],
      class:[61],
      facts:[""]
   },
   {
      generic:["Folic Acid"],
      brand:[],
      class:[59],
      facts:[""]
   },
   {
      generic:["Lidocaine"],
      brand:["Xylocaine"],
      class:[62, 63],
      facts:[""]
   },
   {
      generic:["Sotalol"],
      brand:["Betapace", "Sorine", "Sotylize"],
      class:[64],
      facts:[""]
   },
   {
      generic:["Alendronate"],
      brand:["Fosamax"],
      class:[65],
      facts:[""]
   },
   {
      generic:["Calcitriol"],
      brand:["Rocaltrol"],
      class:[66],
      facts:[""]
   },
   {
      generic:["Calcium Citrate"],
      brand:["Calcitrate", "Caltrate"],
      class:[67],
      facts:[""]
   },
   {
      generic:["Calcium", "Cholecalciferol"],
      brand:["Os-Cal+D"], // Note: LOL
      class:[67, 68],
      facts:[""]
   },
   {
      generic:["Cholecalciferol"],
      brand:["Vitamin D3"],
      class:[69],
      facts:[""]
   },
   {
      generic:["Dessicated Thyroid"],
      brand:["Armour Thyroid", "Nature-Throid", "NP Thyroid"],
      class:[70],
      facts:[""]
   },
   {
      generic:["Dexamethasone"],
      brand:["Decadron", "Dexabliss"],
      class:[71],
      facts:[""]
   },
   {
      generic:["Ergocalciferol"],
      brand:["Vitamin D2"],
      class:[69],
      facts:[""]
   },
   {
      generic:["Ibandronate"],
      brand:["Boniva"],
      class:[65],
      facts:[""]
   },
   {
      generic:["Levothyroxine"],
      brand:["Synthroid", "Levothroid", "Levoxyl", "Unithroid", "Levo-T"],
      class:[72],
      facts:[""]
   },
   {
      generic:["Liothyronine"],
      brand:["Cytomel"],
      class:[72],
      facts:[""]
   },
   {
      generic:["Methimazole"],
      brand:["Tapazole"],
      class:[73],
      facts:[""]
   },
   {
      generic:["Potassium Iodide"],
      brand:["Lugol's Strong Iodine"],
      class:[74],
      facts:[""]
   },
   {
      generic:["Prednisolone"],
      brand:["Millipred"],
      class:[71],
      facts:[""]
   },
   {
      generic:["Risedronate"],
      brand:["Actonel"],
      class:[65],
      facts:[""]
   },
   {
      generic:["Triamcinolone"], // Systemic
      brand:["Kenalog", "Hexatrione"],
      class:[24],
      facts:[""]
   },
   {
      generic:["Calcium Carbonate"],
      brand:["Tums"],
      class:[67],
      facts:[""]
   },
   {
      generic:["Anastrozole"],
      brand:["Arimidex"],
      class:[75],
      facts:[""]
   },
   {
      generic:["Bupropion"],
      brand:["Wellbutrin", "Wellbutrin SR", "Wellbutrin XL", "Zyban", "Forfivo XL"],
      class:[76, 77],
      facts:["Wellbutrin = immediate-release; Wellbutrin SR & Zyban = sustained-release; Wellbutrin XL & Forfivo XL = extended-release"]
   },
   {
      generic:["Darifenacin"],
      brand:["Enablex"],
      class:[78],
      facts:[""]
   },
   {
      generic:["Desogestrel", "Ethinyl Estradiol"],
      brand:[],
      class:[79],
      facts:[""]
   },
   {
      generic:["Diclofenac"],
      brand:["Voltaren", "Zipsor", "Zorvolex"],
      class:[80],
      facts:["Voltaren = topical; Zipsor & Zorvolex = oral/systemic"]
   },
   {
      generic:["Drospirenone", "Ethinyl Estradiol"],
      brand:[],
      class:[79],
      facts:[""]
   },
   {
      generic:["Duloxetine"],
      brand:["Cymbalta"],
      class:[81],
      facts:[""]
   },
   {
      generic:["Dutasteride"],
      brand:["Avodart"],
      class:[82],
      facts:[""]
   },
   {
      generic:["Estradiol"],
      brand:["Estrace", "Fempatch", "Alora", "Climara", "Estraderm", "Vivelle", "Imvexxy", "Estring", "Femring"],
      class:[83],
      facts:["Estrace = oral tablets; Fempatch, Alora, Climara, Estraderm, Vivelle = transdermal patches; Imvexxy, Estring, Femring = vaginal insert"]
   },
   {
      generic:["Conjugated Estrogen"],
      brand:["Premarin", "Ogen"],
      class:[83],
      facts:[""]
   },
   {
      generic:["Ethinyl Estradiol Levonorgestrel"],
      brand:[],
      class:[79],
      facts:[""]
   },
   {
      generic:["Ethinyl Estradiol Norethindrone"],
      brand:[],
      class:[79],
      facts:[""]
   },
   {
      generic:["Ethinyl Estradiol Norgestimate"],
      brand:[],
      class:[79],
      facts:[""]
   },
   {
      generic:["Ethinyl Estradiol Norgestrel"],
      brand:[],
      class:[79],
      facts:[""]
   },
   {
      generic:["Ethinyl Estradiol Etonogestrel"],
      brand:[],
      class:[79],
      facts:[""]
   },
   {
      generic:["Ferrous Sulfate"],
      brand:["Feosol", "Fer-in-Sol"],
      class:[84],
      facts:["Available OTC"]
   },
   {
      generic:["Finasteride"],
      brand:["Proscar"],
      class:[82],
      facts:[""]
   },
   {
      generic:["Fluoxetine"],
      brand:["Prozac", "Sarafem"],
      class:[85],
      facts:[""]
   },
   {
      generic:["Letrozole"],
      brand:["Femara"],
      class:[75],
      facts:[""]
   },
   {
      generic:["Medroxyprogesterone"],
      brand:["Provera", "Depo-Provera"],
      class:[86],
      facts:["Provera = tablet; Depo-Provera = injection"]
   },
   {
      generic:["Mirabegron"],
      brand:["Myrbetriq"],
      class:[87],
      facts:[""]
   },
   {
      generic:["Naproxen"],
      brand:["Naprosyn", "Aleve"],
      class:[80],
      facts:["Naprosyn = Rx (formulations greater than 220 mg); Aleve = OTC (220 mg formulation)"]
   },
   {
      generic:["Norethindrone"],
      brand:[],
      class:[86],
      facts:[""]
   },
   {
      generic:["Ondansetron"],
      brand:["Zofran"],
      class:[88],
      facts:[""]
   },
   {
      generic:["Oxybutynin"],
      brand:["Ditropan", "Oxytrol"],
      class:[78],
      facts:["Ditropan = oral; Oxytrol = patch, Available OTC"]
   },
   {
      generic:["Paroxetine"],
      brand:["Paxil", "Paxil CR"],
      class:[85],
      facts:[""]
   },
   {
      generic:["Progesterone"],
      brand:["Prometrium", "Endometrin"],
      class:[86],
      facts:["Prometrium = oral formulation; Endometrin = vaginal insert"]
   },
   {
      generic:["Raloxifene"],
      brand:["Evista"],
      class:[89],
      facts:[""]
   },
   {
      generic:["Sertraline"],
      brand:["Zoloft"],
      class:[85],
      facts:[""]
   },
   {
      generic:["Sildenafil"],
      brand:["Viagra", "Revatio"],
      class:[90],
      facts:["Viagra = ED; Revatio = pulmonary HTN"]
   },
   {
      generic:["Solifenacin"],
      brand:["Vesicare"],
      class:[79],
      facts:[""]
   },
   {
      generic:["Tadalafil"],
      brand:["Cialis", "Adcirca"],
      class:[90],
      facts:["Cialis = ED; Adcirca = Pulmonary HTN"]
   },
   {
      generic:["Tamsulosin"],
      brand:["Flomax"],
      class:[13],
      facts:[""]
   },
   {
      generic:["Testosterone"],
      brand:["Androderm", "AndroGel"],
      class:[91],
      facts:["Schedule III controlled substance; Androderm = transdermal patch; Androgel = gel"]
   },
   {
      generic:["Tolterodine"],
      brand:["Detrol", "Detrol LA"],
      class:[78],
      facts:["Detrol = IR tablet; Detrol LA = ER capsule"]
   },
   {
      generic:["Vardenafil"],
      brand:["Levitra", "Staxyn"],
      class:[90],
      facts:[""]
   },
   {
      generic:["Venlafaxine"],
      brand:["Effexor", "Effexor XR"],
      class:[81],
      facts:["Pay attention to IR vs. XR"]
   },
   {
      generic:["Misoprostol"],
      brand:["Cytotec"],
      class:[92],
      facts:["Pay attention to IR vs. XR"]
   },
];

let classes =
[
   "Short-Acting Beta-2 Agonist (SABA)",
   "Short-Acting Muscarinic Antagonist (SAMA)",
   "Dihydrophyridine (DHP)",
   "Calcium Channel Blocker (CCB)",
   "ACE Inhibitor",
   "Beta-blocker",
   "HMG Co-A Reductase inhibitor",
   "Intranasal antihistamine",
   "Inhaled corticosteroid", // Todo: This is extra, nothing is using 8 so we'll get rid of it soon. My bad
   "Thiazide Diuretic",
/*10*/ "Inhaled Corticosteroid",
   "Long-Acting Beta-2 Adrenergic Agonist (LABA)",
   "Loop Diuretic",
   "Alpha-1 blocker",
   "Second General Oral Antihistamine",
   "Central alpha-2 agonist",
   "Bile Acid Sequestrant",
   "Non-Dihydropyridine (Non-DHP)",
   "First General Oral Antihistamine",
   "Cholesterol Absorption Inhibitor",
/*20*/ "Fibrate",
   "Intranasal Corticosteroid",
   "Direct Arterial Vasodilator",
   "Angiotensin Receptor Blocker (ARB)",
   "Systemic Corticosteroid",
   "Leukotriene Modifier",
   "Niacin",
   "Omega-3 Fatty Acids",
   "Potassium Supplement",
   "HMG-CoA Reductase Inhibitor",
/*30*/ "Aldosterone Antagonist",
   "Long-Acting Muscarinic Antagonist (LAMA)",
   "Potassium Sparing Diuretic",
   "Alpha-1/Beta-blocker",
   "Sodium-Glucose Cotransporter 2 (SGLT2) Inhibitor",
   "Inotrope",
   "Non-Steroidal Anti-Inflammatory Drug (NSAID)",
   "Nitrate",
   "Glucagon-Like Peptide-1 Receptor Agonist (GLP-1 RA)",
   "Antianginal",
/*40*/ "Short-Term Noradrenergic Agent (Appetite Suppressant)",
   "Neprilysin Inhibitor",
   "Second-Generation Sulfonylurea",
   "Insulin Analog",
   "Insulin",
   "Dipeptidyl Peptidase IV (DPP-4) Inhibitor",
   "Biguanide",
   "Thiazolidinedione",
   "Meglitinide",
/*50*/ "Factor Xa Inhibitor",
   "Anti-platelet",
   "P2Y12 inhibitor",
   "Direct Thrombin Inhibitor",
   "Low Molecular Weight Heparin (LMWH)",
   "Anti-anginal",
   "Vitamin K Antagonist",
   "Heparin",
   "Class III Antiarrhythmic",
   "Essential B Vitamin",
/*60*/ "Erythropoetin-stimulating agent (ESA)",
   "Class IC Anti-Arrhythmic",
   "Class IB Anti-Arrhythmic",
   "Local Anesthetic",
   "Class III Anti-Arrhythmic",
   "Bisphosphonate",
   "Activated Vitamin D Analog",
   "Calcium Supplement",
   "Vitamin D3 Supplement",  // Todo: Is this Just a Vitamin D Supplement? Or specifically should we know Vitamin D3?
   "Vitamin D Supplement",
/*70*/ "Thyroid Supplement",
   "Corticosteroid",
   "Thyroid Hormone Product",
   "Thionamide",
   "Iodide",
   "Aromatase Inhibitor",
   "Norepinephrine reuptake inhibitor",
   "Dopamine reuptake inhibitor",      // Todo: Combine this one with above?
   "Antimuscarinic",
   "Oral Contraceptive (Estrogen/Progestin Combination)",
/*80*/ "Non-steroidal anti-inflammatory drug (NSAID)",
   "Serotonin/Norepinephrine Reuptake Inhibitor (SNRI)",
   "5-alpha reductase inhibitor",
   "Estrogen Hormone",
   "Iron Supplement",
   "Selective Serotonin Reuptake Inhibitor (SSRI)",
   "Progestin Hormone",
   "Beta-3 adrenergic agonist",
   "Antiemetic",
   "Selectvie Estrogen Receptor Modulator (SERM)",
/*90*/ "PDE-5 Inhibitor",
   "Testosterone",
   "Prostaglandin"
]

function by_id(id)
{
   return document.getElementById(id);
}

function random_int(low, high)
{
   return low + Math.floor(Math.random()*(high - low + 1));
}

