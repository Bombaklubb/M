// English word definitions for difficult vocabulary in texts
// Key = word (lowercase), value = { def: definition, ex?: example sentence }

export interface WordDefinition {
  def: string;
  ex?: string;
}

export const WORD_DICTIONARY: Record<string, WordDefinition> = {
  'context': { def: 'The circumstances or background surrounding something', ex: 'You need to know the context to understand the quote.' },
  'perspective': { def: 'A point of view or way of looking at something', ex: "From the students' perspective, the test was difficult." },
  'relevant': { def: 'Closely connected or appropriate to what is being discussed', ex: 'The information was relevant to the task.' },
  'analyze': { def: 'To examine something carefully in order to understand it', ex: 'We will analyze the text to find the main idea.' },
  'phenomenon': { def: 'Something that happens or exists, especially something unusual', ex: 'The Northern Lights are a natural phenomenon.' },
  'complex': { def: 'Complicated; consisting of many different parts', ex: 'The problem was more complex than we thought.' },
  'abstract': { def: 'Relating to ideas rather than concrete things', ex: 'Love is an abstract concept.' },
  'hypothesis': { def: 'A suggested explanation that can be tested', ex: "The scientist's hypothesis turned out to be correct." },
  'theory': { def: 'An explanation supported by evidence', ex: "Darwin's theory of evolution." },
  'innovation': { def: 'A new idea, product, or method', ex: 'Smartphones were a major innovation.' },
  'strategy': { def: 'A plan designed to achieve a goal', ex: 'The team had a good strategy for the match.' },
  'dynamic': { def: 'Constantly changing and active', ex: 'The city has a dynamic atmosphere.' },
  'structure': { def: 'The way something is built or organized', ex: 'The text had a clear structure.' },
  'consequence': { def: 'A result or effect of an action', ex: 'The consequence of the decision was significant.' },
  'conclusion': { def: 'A decision or opinion reached by reasoning', ex: 'My conclusion is that we need more time.' },
  'argument': { def: 'A reason given to support or oppose a viewpoint', ex: 'She had strong arguments for her opinion.' },
  'evidence': { def: 'Information that shows whether something is true or false', ex: 'The detective found evidence at the scene.' },
  'significant': { def: 'Important or large enough to be noticed', ex: 'There was a significant improvement in her grades.' },
  'influence': { def: 'The power to have an effect on people or things', ex: 'Music can have a great influence on our mood.' },
  'impact': { def: 'A strong effect or impression', ex: 'The speech had a big impact on the audience.' },
  'contribute': { def: 'To give or add something to help achieve a result', ex: 'Everyone can contribute to a better environment.' },
  'tradition': { def: 'A custom or belief passed down through generations', ex: 'Celebrating Thanksgiving is an American tradition.' },
  'culture': { def: 'The customs, arts, and values of a society', ex: 'Every country has its own unique culture.' },
  'society': { def: 'People living together with shared rules and customs', ex: 'School is an important part of society.' },
  'individual': { def: 'A single person, as distinct from a group', ex: 'Every individual is unique.' },
  'environment': { def: 'The natural world around us; surroundings', ex: 'We must protect the environment.' },
  'resource': { def: 'A supply that can be used', ex: 'Water is an important natural resource.' },
  'method': { def: 'A way of doing something', ex: 'The teacher used a new method.' },
  'result': { def: 'The outcome of something', ex: 'The result of the experiment surprised everyone.' },
  'effect': { def: 'A change produced by a cause', ex: 'The medicine had a good effect.' },
  'cause': { def: 'The reason why something happens', ex: 'The cause of the fire was unknown.' },
  'process': { def: 'A series of actions that leads to a result', ex: 'Learning is a long process.' },
  'factor': { def: 'Something that influences a result', ex: 'Sleep is an important factor for health.' },
  'narrator': { def: 'The person telling the story', ex: 'The narrator described the setting in detail.' },
  'protagonist': { def: 'The main character in a story', ex: 'The protagonist faced many challenges.' },
  'antagonist': { def: 'A character who opposes the main character', ex: 'The antagonist tried to stop the hero.' },
  'plot': { def: 'The sequence of events in a story', ex: 'The plot of the book was very exciting.' },
  'setting': { def: 'The time and place in which a story occurs', ex: 'The setting was a small village in the 1800s.' },
  'theme': { def: 'The central idea or message of a text', ex: 'The theme of the story was friendship.' },
  'conflict': { def: 'A serious disagreement or struggle', ex: 'The conflict between the characters drove the story.' },
  'resolution': { def: 'The way a conflict is solved in a story', ex: 'The resolution brought peace to the village.' },
  'dialogue': { def: 'Words spoken between characters', ex: 'The dialogue between the two friends felt very real.' },
  'inference': { def: 'A conclusion reached from evidence and reasoning', ex: "We can make an inference about the character's feelings." },
  'literal': { def: 'Exactly as stated; not figurative', ex: 'Take the instructions literally.' },
  'metaphor': { def: 'A comparison that says one thing IS another', ex: '"The world is a stage" is a metaphor.' },
  'simile': { def: 'A comparison using "like" or "as"', ex: '"Fast as lightning" is a simile.' },
  'foreshadowing': { def: 'Hints about what will happen later in the story', ex: 'The dark clouds were foreshadowing trouble ahead.' },
  'ecosystem': { def: 'All living things and their environment in an area', ex: 'The rainforest is a rich ecosystem.' },
  'habitat': { def: 'The natural home of an animal or plant', ex: "The polar bear's habitat is the Arctic." },
  'predator': { def: 'An animal that hunts other animals for food', ex: 'The lion is a predator on the savanna.' },
  'prey': { def: 'An animal that is hunted by a predator', ex: 'Rabbits are prey for foxes.' },
  'migrate': { def: 'To move from one place to another seasonally', ex: 'Many birds migrate south in winter.' },
  'extinct': { def: 'No longer existing', ex: 'Dinosaurs became extinct millions of years ago.' },
  'endangered': { def: 'At risk of becoming extinct', ex: 'The giant panda is an endangered species.' },
  'atmosphere': { def: 'The layer of gases surrounding the Earth; or the mood of a place', ex: 'The atmosphere protects us from the sun.' },
  'gravity': { def: 'The force that pulls objects toward each other', ex: 'Gravity keeps us on the ground.' },
  'organism': { def: 'A living thing', ex: 'Bacteria are tiny organisms.' },
  'photosynthesis': { def: 'The process by which plants make food from sunlight', ex: 'Plants use photosynthesis to produce energy.' },
  'civilization': { def: 'An advanced human society with culture and laws', ex: 'Ancient Egypt was a great civilization.' },
  'democracy': { def: 'A system of government where people vote for their leaders', ex: 'In a democracy, citizens can vote.' },
  'empire': { def: 'A large group of countries ruled by one ruler', ex: 'The Roman Empire was very powerful.' },
  'revolution': { def: 'A major change, often involving the overthrow of a government', ex: 'The French Revolution changed Europe.' },
  'colony': { def: 'A country or area controlled by another country', ex: 'America was once a British colony.' },
  'reluctant': { def: 'Unwilling to do something', ex: 'She was reluctant to speak in front of the class.' },
  'determined': { def: 'Having a firm decision to do something', ex: 'He was determined to finish the race.' },
  'curious': { def: 'Eager to know or learn about something', ex: 'The curious child asked many questions.' },
  'exhausted': { def: 'Very tired, with no energy left', ex: 'After the long hike, she was exhausted.' },
  'tremendous': { def: 'Very great in amount, size, or intensity', ex: 'She made a tremendous effort to succeed.' },
  'peculiar': { def: 'Strange or unusual', ex: 'There was a peculiar smell in the old house.' },
  'ancient': { def: 'Belonging to the very distant past', ex: 'The museum displayed ancient pottery.' },
  'enormous': { def: 'Very large in size or amount', ex: 'The elephant was enormous.' },
  'mysterious': { def: 'Difficult to understand or explain', ex: 'The mysterious stranger never told his name.' },
  'courageous': { def: 'Very brave; not afraid of danger', ex: 'The courageous firefighter saved the child.' },
  'investigate': { def: 'To carefully examine or research something', ex: 'The scientist decided to investigate the mystery.' },
  'observe': { def: 'To watch carefully; to notice', ex: 'We observed the birds through binoculars.' },
  'predict': { def: 'To say what you think will happen in the future', ex: 'Can you predict what happens next in the story?' },
  'summarize': { def: 'To give a short description of the main points', ex: 'Please summarize what happened in the chapter.' },
  'compare': { def: 'To look at how things are similar or different', ex: "Compare the two characters' personalities." },
  'contrast': { def: 'To show how things are different from each other', ex: 'Contrast the two settings in the story.' },

  // Nature & Science
  'absorb': { def: 'To take in or soak up something', ex: 'Plants absorb sunlight to make food.' },
  'adapt': { def: 'To change in order to survive or succeed in a new situation', ex: 'Animals adapt to their environment over time.' },
  'bacteria': { def: 'Tiny living things, some of which can cause illness', ex: 'Wash your hands to remove bacteria.' },
  'carbon': { def: 'A chemical element found in all living things', ex: 'Carbon dioxide is a greenhouse gas.' },
  'chemical': { def: 'A substance made by or used in chemistry', ex: 'The factory released harmful chemicals.' },
  'climate': { def: 'The usual weather in an area over a long period', ex: 'The climate in Sweden is cold in winter.' },
  'current': { def: 'A flow of water, air, or electricity moving in one direction', ex: 'The ocean current moved the boat north.' },
  'decay': { def: 'To rot or break down slowly', ex: 'Leaves decay on the forest floor.' },
  'evolve': { def: 'To develop gradually over time', ex: 'Species evolve over millions of years.' },
  'fossil': { def: 'The preserved remains of an ancient living thing', ex: 'They found a dinosaur fossil in the rock.' },
  'generate': { def: 'To produce or create something', ex: 'Solar panels generate electricity.' },
  'genetic': { def: 'Relating to genes and inherited characteristics', ex: 'The disease has a genetic cause.' },
  'glacier': { def: 'A large, slow-moving mass of ice', ex: 'The glacier carved a valley in the mountains.' },
  'harvest': { def: 'To collect crops or natural resources', ex: 'Farmers harvest wheat in late summer.' },
  'particle': { def: 'A very small piece of matter', ex: 'Dust particles float in the air.' },
  'pressure': { def: 'A force pushing on something; a feeling of stress', ex: 'The pressure of deep water can crush a submarine.' },
  'radiation': { def: 'Energy sent out as waves or particles', ex: 'The sun sends out radiation.' },
  'reproduce': { def: 'To produce offspring; to make a copy', ex: 'Most animals reproduce in spring.' },
  'species': { def: 'A group of living things that can reproduce together', ex: 'The blue whale is an endangered species.' },
  'temperature': { def: 'A measure of how hot or cold something is', ex: 'The temperature dropped below zero at night.' },
  'toxin': { def: 'A poisonous substance produced by a living thing', ex: 'The mushroom contains a dangerous toxin.' },
  'vessel': { def: 'A ship or boat; also a tube carrying blood', ex: 'The research vessel sailed into the deep ocean.' },
  'expedition': { def: 'A journey made for a specific purpose, often to explore', ex: 'The expedition reached the South Pole.' },
  'submarine': { def: 'A vehicle that travels underwater', ex: 'The submarine dove to 500 metres below the surface.' },
  'prey': { def: 'An animal hunted by another for food', ex: 'The anglerfish uses light to attract prey.' },
  'survival': { def: 'The state of continuing to live in difficult conditions', ex: 'Survival in the Arctic requires warm clothing.' },
  'shallow': { def: 'Not deep', ex: 'Children swam in the shallow part of the pool.' },

  // Society & History
  'alliance': { def: 'An agreement to work together', ex: 'The two countries formed an alliance.' },
  'ancestor': { def: 'A person from whom you are descended', ex: 'My ancestors came from Ireland.' },
  'authority': { def: 'The power to make decisions and give orders', ex: 'The principal has authority over the school.' },
  'citizen': { def: 'A person who belongs to a country', ex: 'Every citizen has the right to vote.' },
  'conflict': { def: 'A serious disagreement or fight', ex: 'The conflict between the two groups lasted for years.' },
  'constitution': { def: 'A set of laws that governs a country', ex: 'The constitution protects citizens\' rights.' },
  'corrupt': { def: 'Dishonest and willing to act illegally for personal gain', ex: 'The corrupt official accepted bribes.' },
  'drought': { def: 'A long period without rain', ex: 'The drought destroyed the crops.' },
  'equality': { def: 'The state of being equal in rights and opportunities', ex: 'The movement fought for equality.' },
  'exploit': { def: 'To use unfairly for your own benefit', ex: 'Workers were exploited in unsafe conditions.' },
  'famine': { def: 'A severe shortage of food in a region', ex: 'The famine left thousands of people hungry.' },
  'global': { def: 'Relating to the whole world', ex: 'Climate change is a global problem.' },
  'govern': { def: 'To control and make decisions for a country or group', ex: 'Elected officials govern the city.' },
  'immigrant': { def: 'A person who comes to live in a new country', ex: 'My grandmother was an immigrant from Poland.' },
  'independence': { def: 'Freedom from control by others', ex: 'The country gained independence in 1776.' },
  'inequality': { def: 'Unfair differences in how people are treated', ex: 'Income inequality is a major social issue.' },
  'justice': { def: 'Fair treatment and behavior', ex: 'The protesters demanded justice.' },
  'migration': { def: 'The movement of people or animals from one place to another', ex: 'Climate change is causing migration from dry regions.' },
  'parliament': { def: 'The group of elected people who make a country\'s laws', ex: 'The law was passed by parliament.' },
  'poverty': { def: 'The state of being extremely poor', ex: 'Many families live in poverty.' },
  'protest': { def: 'To show disapproval of something publicly', ex: 'Students gathered to protest the new law.' },
  'reform': { def: 'A change made to improve something', ex: 'The government introduced education reform.' },
  'refugee': { def: 'A person who has fled their country due to danger', ex: 'Thousands of refugees crossed the border.' },
  'sovereignty': { def: 'The power of a country to govern itself', ex: 'The nation defended its sovereignty.' },
  'treaty': { def: 'A formal agreement between countries', ex: 'The two nations signed a peace treaty.' },
  'welfare': { def: 'Health, happiness, and safety; also government support for the poor', ex: 'The government spends money on social welfare.' },

  // Technology & Media
  'algorithm': { def: 'A set of rules followed by a computer to solve a problem', ex: 'Search engines use algorithms to rank results.' },
  'artificial': { def: 'Made by humans, not nature', ex: 'Artificial intelligence can learn from data.' },
  'broadcast': { def: 'To send out information on radio, TV, or the internet', ex: 'The news was broadcast live.' },
  'data': { def: 'Facts and information collected for analysis', ex: 'Scientists collected data from the experiment.' },
  'digital': { def: 'Using computer technology or the internet', ex: 'We live in a digital world.' },
  'network': { def: 'A system of connected things or people', ex: 'The internet is a global network.' },
  'publish': { def: 'To make information available to the public', ex: 'She published her research in a journal.' },
  'reliable': { def: 'Consistently good and able to be trusted', ex: 'A reliable source provides accurate facts.' },
  'source': { def: 'The place where information or something comes from', ex: 'Always check your sources before sharing information.' },
  'surveillance': { def: 'Watching or monitoring people closely', ex: 'Security cameras are used for surveillance.' },
  'transparent': { def: 'Open and honest; easy to see through', ex: 'The company was transparent about its costs.' },

  // Story vocabulary
  'abandoned': { def: 'Left behind; no longer used or cared for', ex: 'They found an abandoned house in the forest.' },
  'anxious': { def: 'Worried or nervous about something', ex: 'She felt anxious before the test.' },
  'appreciate': { def: 'To recognize the value of something; to be grateful', ex: 'He appreciated her help during the difficult time.' },
  'bitter': { def: 'Having a sharp, unpleasant taste; feeling deep anger or sadness', ex: 'The medicine tasted bitter.' },
  'breakthrough': { def: 'An important discovery or achievement', ex: 'The new vaccine was a medical breakthrough.' },
  'burden': { def: 'A heavy load; something difficult to carry or deal with', ex: 'The responsibility was a heavy burden.' },
  'ceremony': { def: 'A formal event held to mark an important occasion', ex: 'The graduation ceremony was held outside.' },
  'companion': { def: 'A person or animal you spend time with', ex: 'The dog was his loyal companion.' },
  'cope': { def: 'To deal successfully with a difficult situation', ex: 'She learned to cope with stress.' },
  'desperate': { def: 'Feeling hopeless and willing to do anything', ex: 'He was desperate to find his lost dog.' },
  'dignified': { def: 'Calm and serious, deserving respect', ex: 'She gave a dignified speech at the ceremony.' },
  'embarrassed': { def: 'Feeling ashamed or awkward', ex: 'He was embarrassed when he forgot his lines.' },
  'empathy': { def: 'The ability to understand and share another\'s feelings', ex: 'Showing empathy helps build friendships.' },
  'grateful': { def: 'Feeling thankful for something', ex: 'She was grateful for all the support she received.' },
  'humiliate': { def: 'To make someone feel ashamed in front of others', ex: 'He did not want to humiliate his teammate.' },
  'isolated': { def: 'Far from others; alone', ex: 'The island community felt isolated from the mainland.' },
  'motivate': { def: 'To give someone a reason to act or work hard', ex: 'Good teachers motivate their students.' },
  'negotiate': { def: 'To discuss something to reach an agreement', ex: 'The two sides agreed to negotiate a solution.' },
  'obstacle': { def: 'Something that blocks your way or makes progress difficult', ex: 'Lack of money was the main obstacle.' },
  'optimistic': { def: 'Hopeful and confident about the future', ex: 'She remained optimistic despite the challenges.' },
  'persevere': { def: 'To keep trying despite difficulties', ex: 'You must persevere to achieve your goals.' },
  'privilege': { def: 'A special right or advantage not everyone has', ex: 'Access to clean water is a privilege in some parts of the world.' },
  'sacrifice': { def: 'To give up something valuable for a greater good', ex: 'Parents often sacrifice their own comfort for their children.' },
  'tolerance': { def: 'Willingness to accept different opinions or ways of living', ex: 'The school promoted tolerance and respect.' },
  'vulnerable': { def: 'Easily hurt or harmed; in need of protection', ex: 'Young children are vulnerable and need care.' },

  // Academic & text words
  'acknowledge': { def: 'To recognize or admit something is true', ex: 'She acknowledged that mistakes had been made.' },
  'assumption': { def: 'Something accepted as true without proof', ex: 'His plan was based on incorrect assumptions.' },
  'bias': { def: 'Unfair preference for or against something', ex: 'The report showed a clear bias toward one side.' },
  'chronological': { def: 'Arranged in the order in which events happened', ex: 'The story was told in chronological order.' },
  'cite': { def: 'To mention a source to support an argument', ex: 'She cited three studies in her essay.' },
  'contradict': { def: 'To say the opposite of what someone else has said', ex: 'The new evidence contradicted his statement.' },
  'debate': { def: 'A discussion where people argue different sides', ex: 'The class had a debate about screen time.' },
  'definition': { def: 'An explanation of what a word means', ex: 'Look up the definition in a dictionary.' },
  'emphasize': { def: 'To give special importance to something', ex: 'The teacher emphasized the importance of revision.' },
  'evaluate': { def: 'To judge the quality or value of something', ex: 'Evaluate both sides before making a decision.' },
  'imply': { def: 'To suggest something without saying it directly', ex: 'Her tone implied she was unhappy.' },
  'interpret': { def: 'To explain the meaning of something', ex: 'How do you interpret the last line of the poem?' },
  'objective': { def: 'Not influenced by personal feelings; fair', ex: 'Try to be objective when giving feedback.' },
  'paraphrase': { def: 'To restate something in different words', ex: 'Paraphrase the paragraph in your own words.' },
  'quote': { def: 'To repeat the exact words of someone else', ex: 'She quoted the author directly in her essay.' },
  'subjective': { def: 'Based on personal feelings or opinions', ex: 'Whether art is beautiful is subjective.' },
  'valid': { def: 'Based on sound reasoning; legally acceptable', ex: 'That is a valid point in the argument.' },
};

// Swedish definitions for grade 1–3 texts
export const SWEDISH_WORD_DICTIONARY: Record<string, WordDefinition> = {
  // Grade 1 – The Lost Hat
  'windy':     { def: 'Blåsigt – det blåser mycket ute', ex: 'Det var en blåsig morgon.' },
  'flew':      { def: 'Flög – rörde sig snabbt genom luften', ex: 'Hatten flög iväg i vinden.' },
  'landed':    { def: 'Landade – föll ner och stannade på ett ställe', ex: 'Hatten landade nära ett träd.' },
  'thanked':   { def: 'Tackade – sa tack till någon', ex: 'Hon tackade honom för hjälpen.' },

  // Grade 1 – The Tiny Garden
  'planted':   { def: 'Planterade – satte ner frön eller plantor i jord', ex: 'De planterade blommor i trädgården.' },
  'shovels':   { def: 'Spadar – verktyg som används för att gräva i jord', ex: 'De använde spadar för att gräva hål.' },
  'buckets':   { def: 'Hinkar – behållare för att bära vatten', ex: 'De bar vatten i gröna hinkar.' },
  'neighbor':  { def: 'Granne – en person som bor nära dig', ex: 'Hon gav en blomma till sin granne.' },

  // Grade 1 – The New Soccer Ball
  'practiced': { def: 'Övade – tränade något om och om igen', ex: 'De övade att passa bollen.' },
  'wheelchair':{ def: 'Rullstol – en stol med hjul för den som har svårt att gå', ex: 'Barnet satt i en rullstol.' },

  // Grade 1 – The Busy Library
  'librarian': { def: 'Bibliotekarie – en person som arbetar på ett bibliotek', ex: 'Bibliotekarien hjälpte henne hitta en bok.' },
  'dolphins':  { def: 'Delfiner – smarta havsdjur som lever i grupper', ex: 'Hon läste en bok om delfiner.' },
  'borrowed':  { def: 'Lånade – tog med sig hem för en tid och ska lämna tillbaka', ex: 'Hon lånade två böcker från biblioteket.' },
  'quietly':   { def: 'Tyst – utan att göra ljud', ex: 'Hon satt och läste tyst i stolen.' },

  // Grade 1 – The Rainy Day Soup
  'stirred':   { def: 'Rörde om – rörde runt med en sked', ex: 'Han rörde om i soppan försiktigt.' },
  'elderly':   { def: 'Äldre – en gammal person', ex: 'Han delade soppan med sin äldre granne.' },
  'wooden':    { def: 'Av trä – gjord av trä', ex: 'Han rörde om med en träsked.' },

  // Grade 2 – The Lost Kitten
  'hiding':    { def: 'Gömde sig – stannade på ett hemligt ställe', ex: 'Katten gömde sig bakom buskarna.' },
  'blanket':   { def: 'Filt – ett mjukt täcke att ligga under', ex: 'De lade en filt i korgen åt katten.' },
  'poster':    { def: 'Affisch – en lapp eller bild som sätts upp på en vägg eller stolpe', ex: 'De såg en affisch om den försvunna katten.' },
  'missing':   { def: 'Försvunnen – inte på sin vanliga plats', ex: 'Familjen letade efter sin försvunna katt.' },

  // Grade 2 – A Rainy Soccer Match
  'muddy':     { def: 'Lerig – full av lera, blött och smutsigt', ex: 'Planen var lerig efter regnet.' },
  'slipped':   { def: 'Halkade – tappade balansen och gled till', ex: 'Han halkade på den lervåta planen.' },
  'scored':    { def: 'Gjorde mål – fick bollen i mål', ex: 'Noor gjorde det avgörande målet.' },
  'heavy':     { def: 'Kraftigt/tungt – mycket av något, t.ex. regn', ex: 'Det föll kraftigt regn.' },

  // Grade 2 – The School Garden
  'soil':      { def: 'Jord – den mörka, mjuka marken där växter växer', ex: 'Fröna sattes ner i jorden.' },
  'sunlight':  { def: 'Solljus – ljuset som kommer från solen', ex: 'Växter behöver solljus för att växa.' },
  'picnic':    { def: 'Picknick – en måltid utomhus, ofta i en park', ex: 'De åt tillsammans under en skolpicknick.' },
  'term':      { def: 'Termin – en del av skolåret', ex: 'I slutet av terminen skördade de grönsakerna.' },

  // Grade 2 – Sam and the New Student
  'nervous':   { def: 'Nervös – orolig och lite rädd inför något', ex: 'Sam var nervös när den nye eleven kom.' },
  'invited':   { def: 'Bjöd in – frågade om någon ville vara med', ex: 'Sam bjöd in Robin att sitta vid bordet.' },

  // Grade 2 – The Busy Bakery
  'cinnamon':  { def: 'Kanel – ett sött krydda som används i bullar och kakor', ex: 'Det luktade kanel i bageriet.' },
  'customers': { def: 'Kunder – personer som köper saker i en butik', ex: 'Många kunder kom till bageriet.' },
  'festival':  { def: 'Festival – ett stort evenemang med musik och aktiviteter', ex: 'En musikfestival hölls i närheten.' },
  'muffin':    { def: 'Muffin – ett litet, mjukt bakverk', ex: 'Hon fick en blåbärsmuffin som tack.' },

  // Grade 3 – The Lost Backpack
  'suddenly':  { def: 'Plötsligt – på ett oväntat sätt, utan förvarning', ex: 'Plötsligt märkte hon att väskan saknades.' },
  'worried':   { def: 'Orolig – rädd att något dåligt ska hända', ex: 'Ella kände sig orolig när hon inte hittade väskan.' },

  // Grade 3 – The Tiny Garden
  'impatient': { def: 'Otålig – ville att något skulle hända snabbare', ex: 'Leo blev otålig när ingenting hände.' },
  'reminded':  { def: 'Påminde – sa till någon att tänka på något de glömt', ex: 'Mina påminde honom om att ha tålamod.' },
  'measured':  { def: 'Mätte – tog reda på hur lång eller stor något är', ex: 'De mätte plantorna varje lördag.' },

  // Grade 3 – The School Talent Show
  'rehearsed': { def: 'Repeterade – övade inför en föreställning', ex: 'De repeterade sina nummer varje eftermiddag.' },
  'confident': { def: 'Säker på sig själv – trodde på sin egen förmåga', ex: 'Nora kände sig mer säker inför uppträdandet.' },
  'encouraged':{ def: 'Uppmuntrade – sade positiva saker för att hjälpa någon framåt', ex: 'Amir uppmuntrade Nora att öva.' },

  // Grade 3 – A Day at the Science Museum
  'exhibit':   { def: 'Utställning – en samling föremål eller aktiviteter att titta på', ex: 'De stannade länge vid bro-utställningen.' },
  'electricity':{ def: 'Elektricitet – den osynliga kraft som får lampor att lysa', ex: 'De skapade elektricitet genom att snurra på hjulen.' },
  'explored':  { def: 'Utforskade – gick runt och undersökte noga', ex: 'De utforskade rum fyllda med robotar och modeller.' },
  'astronauts':{ def: 'Astronauter – personer som reser ut i rymden', ex: 'De såg en film om astronauter i rymden.' },

  // Grade 3 – The Mountain Rescue Dog
  'rescue':    { def: 'Räddning – att hjälpa någon som är i fara', ex: 'Räddningshunden hittade den vilsna skidåkaren.' },
  'separated': { def: 'Skild från gruppen – hade tappat bort de andra', ex: 'Skidåkaren hade blivit skild från sina vänner.' },
  'sniffing':  { def: 'Nosar – luktar noga på något för att hitta information', ex: 'Hunden nosar på snön för att hitta spår.' },
  'flashlights':{ def: 'Ficklampor – små lampor man håller i handen', ex: 'De tog med ficklampor in i stormen.' },

  // Grade 3 – The Clever Fox
  'pretended': { def: 'Låtsades – agerade som om något var sant, fast det inte var det', ex: 'Räven låtsades sova.' },
  'curious':   { def: 'Nyfiken – ville gärna ta reda på mer eller se vad som hände', ex: 'Den nyfikna kaninen kom allt närmare.' },
  'surface':   { def: 'Yta – det översta lagret, t.ex. på vatten', ex: 'Inga fiskar simmade nära ytan.' },
};

// Get all words in a text that have definitions
export function getDefinedWords(text: string): string[] {
  const words = text.toLowerCase().match(/[a-z]+/gi) || [];
  const uniqueWords = [...new Set(words)];
  return uniqueWords.filter(word => WORD_DICTIONARY[word.toLowerCase()]);
}

// Check if a word has a definition
export function hasExplanation(word: string, grade?: number): boolean {
  const w = word.toLowerCase();
  if (grade !== undefined && grade <= 3) return !!SWEDISH_WORD_DICTIONARY[w];
  return !!WORD_DICTIONARY[w];
}

// Get the definition for a word
export function getWordDefinition(word: string, grade?: number): WordDefinition | null {
  const w = word.toLowerCase();
  if (grade !== undefined && grade <= 3) return SWEDISH_WORD_DICTIONARY[w] || null;
  return WORD_DICTIONARY[w] || null;
}
